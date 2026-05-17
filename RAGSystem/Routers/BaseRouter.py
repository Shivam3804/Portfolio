from fastapi import APIRouter

from Routers.ChatAssistantRouter import chat_router
from Engine.chat_engine import ChatBot

baseRouter = APIRouter(prefix='/my-portfolio/api/v0')

@baseRouter.get('/ping')
async def ping():
    is_online = await ChatBot.ping_chatbot()
    
    if is_online:
        return {"ping":True}


baseRouter.include_router(chat_router)
