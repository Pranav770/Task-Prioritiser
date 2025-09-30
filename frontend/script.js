const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Backend API URL
const API_URL = "http://127.0.0.1:8000";

// Function to render tasks
function renderTasks(tasks) {
    taskList.innerHTML = "";
    tasks.forEach(t => {
        const li = document.createElement("li");
        li.textContent = t.task;  // each task is {"task": "..."}
        taskList.appendChild(li);
    });
}

// Fetch tasks from backend on page load
async function loadTasks() {
    const res = await fetch(`${API_URL}/tasks`);
    const tasks = await res.json();
    renderTasks(tasks);
}

// Add task (send to backend)
addBtn.addEventListener("click", async () => {
    const task = taskInput.value.trim();
    if (task !== "") {
        await fetch(`${API_URL}/add_task`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: task })
        });
        taskInput.value = "";
        loadTasks(); // refresh task list
    }
});

// Load tasks when page opens
loadTasks();
