from fastapi import APIRouter
import httpx
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

@router.get("/suggest/{query}")
async def suggest_cities(query: str):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    url = "http://api.openweathermap.org/geo/1.0/direct"
    params = {
        "q": query,
        "limit": 7,
        "appid": api_key
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()

    suggestions = []
    for city in data:
        name = city.get("name", "")
        state = city.get("state", "")
        country = city.get("country", "")
        full_name = f"{name}, {state}, {country}" if state else f"{name}, {country}"
        suggestions.append({
            "name": name,
            "full_name": full_name,
            "state": state,
            "country": country,
        })

    return {"suggestions": suggestions}


@router.get("/{city}")
async def get_weather(city: str):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": api_key,
        "units": "metric"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()

    if response.status_code != 200:
        return {"error": data.get("message", "City not found!")}

    return {
        "city": data["name"] + ", " + data["sys"]["country"],
        "temperature": round(data["main"]["temp"], 1),
        "feels_like": round(data["main"]["feels_like"], 1),
        "humidity": data["main"]["humidity"],
        "weather": data["weather"][0]["description"],
        "wind_speed": data["wind"]["speed"]
    }
