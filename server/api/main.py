import os
from fastapi import FastAPI, Request,Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from supabase import create_client, Client



load_dotenv()
app = FastAPI()



url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to this fantastic app!"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/tasks")
async def tasks_data(status: str = Query(None)):
    from datetime import datetime, timedelta, timezone

    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow = today + timedelta(days=1)

    query = (
        supabase.table("tasks")
        .select("*")
        .gte("created_at", today.isoformat())
        .lt("created_at", tomorrow.isoformat())
    )

    if status is not None:
        query = query.eq("is_complete", True)

    response = query.execute()

    return JSONResponse(
        status_code=201,
        content={"isError": False, "data": response.data}
    )



@app.post("/api/task")
async def add_task(request: Request):
    body = await request.json()

    title = body.get("title")
    description = body.get("description")

    if not title:
        return JSONResponse(
        status_code=400,
        content={
            "message": "Title can't be empty",
            "isError": True
        }
    )

    response = (
        supabase
        .table("tasks")
        .insert({
            "title": title,
            "description": description,
            "is_complete": False,
        })
        .execute()
    )



    return JSONResponse(
        status_code=201,
        content={"message": "Task added successfully!", "isError": False, "data": response.data[0]}
    )

@app.delete("/api/task/{id}")
async def delete_task(id: str, request: Request):
    

    response = (
        supabase.table("tasks")
        .delete()
        .eq("id", id)
        .execute()
    )

    return JSONResponse(
        status_code=200,
        content={"message": "Task deleted!", "isError": False}
    )


@app.post("/api/complete-task/{id}")
async def toggle_complete_task(id: str, request: Request):

    getData = (
        supabase.table("tasks")
        .select("*")
        .eq("id", id)
        .single()
        .execute()
    )

    updateData = (
        supabase.table("tasks")
        .update({"is_complete": not getData.data["is_complete"]})
        .eq("id", id)
        .execute()
    )



    return JSONResponse(
        status_code=200,
        content={ "message": "Task marked as not completed" if getData.data["is_complete"] else "Task marked as completed", "isError": False}
    )

