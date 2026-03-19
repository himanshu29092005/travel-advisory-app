from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv
from typing import List

load_dotenv()
router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    budget: float
    interests: List[str]

@router.post("/")
async def chat(req: ChatRequest):
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        prompt = f"""You are an expert travel advisor.
Budget: Rs.{req.budget}
Interests: {', '.join(req.interests) if req.interests else 'General'}
Question: {req.message}

Give helpful travel suggestions in English with specific places, costs and tips."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        
        return {"reply": response.choices[0].message.content}
    
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return {"reply": f"Error: {str(e)}"}