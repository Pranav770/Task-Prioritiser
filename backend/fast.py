from fastapi import FastAPI
from pydantic import BaseModel
import json
import os

app = FastAPI()

# Pydantic model for input validation
class Task(BaseModel):
    task: str

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

@app.post("/add_task")
def add_task(task: Task):
    tasks = load_tasks()
    tasks.append(task.model_dump())  # append new task
    save_tasks(tasks)
    return {"message": "Task added successfully"}
