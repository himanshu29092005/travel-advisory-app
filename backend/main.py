from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import weather, chat

app = FastAPI(title="Travel Advisory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://travelmadeeazy.vercel.app",
        "https://travelmadeeazy-qofcsxhuw-sachdevahimanshu2909-6407s-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router, prefix="/api/weather")
app.include_router(chat.router, prefix="/api/chat")

@app.get("/")
def root():
    return {"message": "Travel Advisory API chal raha hai!"}
