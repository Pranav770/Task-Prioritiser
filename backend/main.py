from fastapi import FastAPI
from pydantic import BaseModel,Field
import json
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS so frontend can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    task: str
    priority: int = Field(..., ge=1, le=10)
    DueDate: str = None       
    dependency: str = None    

# File path
FILE_PATH = "tasks.json"

def load_tasks():
    if os.path.exists(FILE_PATH):
        with open(FILE_PATH, "r") as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    with open(FILE_PATH, "w") as f:
        json.dump(tasks, f, indent=4)

# Helper: generate new ID like T1, T2, T3...
def generate_task_id(tasks):
    if not tasks:
        return "T1"
    last_id = tasks[-1].get("id", "T0")  # fallback if id missing
    last_num = int(last_id[1:])  # extract number from "T5" -> 5
    return f"T{last_num + 1}"

@app.post("/add_task")
def add_task(task: Task,):
    tasks = load_tasks()
    new_id = generate_task_id(tasks)
    task_data = task.dict()
    task_data["id"] = new_id
    tasks.append(task_data)
    save_tasks(tasks)
    return {"tasks": tasks}

@app.get("/tasks")
def get_tasks():
    return load_tasks()

@app.post("/delete_task")
def delete_task(data: dict):
    task_name = data.get("task")
    if not task_name:
        return {"error": "Task name is required"}

    tasks = load_tasks()
    # Remove all tasks that match this name
    updated_tasks = [t for t in tasks if t["task"] != task_name]
    save_tasks(updated_tasks)

    return {"tasks": updated_tasks}
