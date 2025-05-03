from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from openai import OpenAI
import os

# Load your API key (or use dotenv)
client = OpenAI(
    api_key=os.getenv("LLM_API_KEY"),
    base_url="https://api.llmapi.com"
)

app = FastAPI()

class TaskRequest(BaseModel):
    task: str

@app.post("/breakdown")
def get_task_breakdown(request: TaskRequest):
    task = request.task

    prompt = f"""
"""

    try:
        response = client.chat.completions.create(
            model="llama3.1-70b",
            messages=[
                {"role": "system", "content": "You are a task planning assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=800
        )

        return response.choices[0].message.content

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
