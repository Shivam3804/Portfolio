from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from Routers.BaseRouter import baseRouter

with open("Config/app.config.json", 'r', encoding='utf-8') as reader:
    config = json.load(reader)

app = FastAPI(
    title=config['title'],
    docs_url=config['docs-path']
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


app.include_router(baseRouter)

if __name__ == '__main__':
    uvicorn.run(
        'main:app', 
        host=config['host'],
        port=config['port'],
        reload=config['env'] == 'TESTING'
    )