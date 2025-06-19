import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from supabase import create_client, Client


load_dotenv()


app = FastAPI()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)


# Allow frontend (Vite) to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/tasks")
async def tasks_data():
    from datetime import datetime, timedelta, timezone

    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow = today + timedelta(days=1)

    response = (
        supabase.table("tasks")
        .select("*")
        .gte("created_at", today.isoformat())
        .lt("created_at", tomorrow.isoformat())
        .execute()
    )



    return {"message": response, "status": 200, "isError" : False}


@app.post("/api/tasks")
async def add_task(request: Request):
    body = await request.json()

    title = body.get("title")
    description = body.get("description")

    if not title:
        return {"message": "Title can't be empty", "status": 400, "isError": True}


    response = (
        supabase
        .table("tasks")
        .insert({
            "title": title,
            "description": description,
            "is_completed": False,
        })
        .execute()
    )



    return {"message": response, "status": 200, "isError" : False}



