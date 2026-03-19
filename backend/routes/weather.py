from fastapi import APIRouter
import httpx
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

@router.get("/{city}")
async def get_weather(city: str):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    
    url = f"https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": api_key,
        "units": "metric"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
    
    if response.status_code != 200:
        return {"error": data.get("message", "Kuch gadbad hui")}
    
    return {
        "city": city,
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "humidity": data["main"]["humidity"],
        "weather": data["weather"][0]["description"],
        "wind_speed": data["wind"]["speed"]
    }