from pydantic import BaseModel
from typing import List

class ResumeResponse(BaseModel):
    text: str
    links: List[str]
