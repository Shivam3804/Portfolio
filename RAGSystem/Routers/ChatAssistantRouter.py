from fastapi import APIRouter
from Engine.chat_engine import ChatBot
from pydantic import BaseModel

chat_router = APIRouter(
    prefix="/chatbot",
    tags=['ChatBot']
)


class ChatRequest(BaseModel):
    query: str



@chat_router.put('/update-resume')
async def update_resume():
    try:
        res = await ChatBot.upload_resume('Resources/SHIVAM_PATIL.pdf')
        return {'successfully updated the resume'}
    except Exception as e:
        return {f'Error while updating resume: {e}'}


@chat_router.post('/chat')
async def chat(data:ChatRequest):
    try:
        res = await ChatBot.ask(data.query)
        return res
    except Exception as e:
        print(e)
        return {"ping": False}