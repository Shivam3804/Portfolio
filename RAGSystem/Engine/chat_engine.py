from Engine.data_pipeline import ResumeVectorClient
from langchain.chat_models import init_chat_model
from Engine.schema import ResumeResponse
import requests
import json
import asyncio


with open('Config/rag.config.json', 'r') as file:
    data = json.load(file)

model = init_chat_model(
    model_provider=data['llm_provider'],
    model=data['llm_model'],
    api_key=data['google_key'],
    temperature=0.4
).with_structured_output(ResumeResponse)



class ResumeAssistant:
    def __init__(self, vector_store=ResumeVectorClient, llm=model, webhook_url=data['webhook_url'], threshold=0.5):
        """
        vector_store → ResumeVectorStore instance
        llm → generative model
        webhook_url → Google Chat webhook
        threshold → relevance cutoff
        """
        self.vector_store = vector_store
        self.llm = llm
        self.webhook_url = webhook_url
        self.threshold = threshold

    # ---------------------------
    # PING THE MODEL
    # ---------------------------
    async def ping_chatbot(self):
        try:
            await asyncio.to_thread(
                self.llm.invoke,
                "ping"
            )
            return True

        except Exception:
            return False

    # ---------------------------
    # 1. BUILD / UPDATE INDEX
    # ---------------------------
    async def upload_resume(self, path):
        await self.vector_store.build_from_pdf(path)
        await self.vector_store.save()
        return "Resume processed and indexed successfully."

    # ---------------------------
    # 2. MAIN QUERY FUNCTION
    # ---------------------------
    async def ask(self, query):

        await self.vector_store.load()

        if not self.vector_store.index or not self.vector_store.metadata:
            return self._fallback_response()
        results = await self.vector_store.search(query, k=15)

        relevant = [r for r in results if r["score"] >= self.threshold]


        try:
            if relevant:
                return await self._generate_answer(query, relevant)
            else:
                return await self._send_to_webhook(query, context=results)
        except Exception as e:
            print('This is the error: ',str(e))
            return await self._send_to_webhook(query=None, error='Error in Embedder API')

    # ---------------------------
    # GENERATION
    # ---------------------------
    async def _generate_answer(self, query, context_items):
        context_items = context_items[:5] if len(context_items) > 5 else context_items
        context = "\n\n".join(
            f"{item.get('text', '')}\nSource: {item.get('url', '')}"
            for item in context_items
        )

        system_prompt = f"""
            You are a professional AI assistant answering questions about a resume.

            IMPORTANT:
            - All questions are about the resume owner (the candidate), not you.
            - Answer as if you are the resume owner.
            - Always respond in FIRST PERSON (e.g., "I built...", "I worked...", "I studied...").

            RULES:
            - Only use the provided context.
            - If the query is greeting or similar one, then give the approriate response. Example, "hi" -> "hi, Im Shivam Patil,....."
            - Do NOT invent any information.
            - Be concise, clear, and human-like.
            - If the answer is not in the context, say:
            "I don't have enough information to answer that."

            CONTEXT:
            {context}
            """


        try:
            response = await asyncio.to_thread(
                self.llm.invoke,
                f"{system_prompt}\nUser Question:\n{query}"
            )
            
            return response.model_dump()

        except Exception as e:
            print(str(e))
            return await self._send_to_webhook(
                query,
                error=str(e)
            )

    # ---------------------------
    # WEBHOOK
    # ---------------------------
    async def _send_to_webhook(self, query, context=None, error=None):

        if not self.webhook_url:
            self._fallback_response()
        
        if not context and not error:
            payload =  {
                "text": f"⚠️ New Unanswered Query:\n\nQuery: {query}\n\nContext:\nContext Unsufficient"
            }

        if context is not None:
            formatted_context = "\n\n".join(
                f"{item.get('text','')}\n{item.get('url','')}"
                for item in context[:3]
            )
            payload = {
                "text": f"⚠️ New Unanswered Query:\n\nQuery: {query}\n\nContext:\n{formatted_context}"
            }

        if error:
            payload = {
                "text": f"⚠️ New Unanswered Query:\n\nQuery: {query}\nError:\n{error}"
            }

        try:
            await asyncio.to_thread(
                requests.post,
                self.webhook_url,
                json=payload
            )

            if error:
                return self._fallback_response(details='Looks like somethings wrong with bot, Maybe API Limit Exceeded 😭')
            if context is not None:
                return self._fallback_response()
            else:
                return self._fallback_response(details="I don't have enough information to answer that question")

        except Exception as e:
            return self._fallback_response(details='Looks like somthings wrong, my webhook is not working')

    # ---------------------------
    # FALLBACK RESPONSE
    # ---------------------------
    def  _fallback_response(self, details="Looks like I need a bit more training on this topic."):
        return {
            'text': f'''😅 Hmm... that’s a new one for me!\n\n
                {details}\n
                Don’t worry — I’ve sent this question to my creator 🧠, 
                and we’ll get back to you soon!\n\n
                Meanwhile, feel free to explore other parts of the resume or portfolio 🚀''',
            "links": []
        }
    
    async def _send_user_details(self, name=None, message=None):

        if not self.webhook_url:
            return
        

        if not name:
            name = 'Anonymous User'

        if not message:
            message = 'No idea'

        payload = {
            "text": f"👋 New Guest on Porfolio:\n\nUser: {name}\nMessage:\n{message}"
        }

        try:
            await asyncio.to_thread(
                requests.post,
                self.webhook_url,
                json=payload
            )
            return True
        except Exception as e:
            self._fallback_response(details='Looks like somthings wrong , my webhook is not working')
            return False


ChatBot = ResumeAssistant()
