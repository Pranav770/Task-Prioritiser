const taskInput1 = document.getElementById("taskInput1");
const taskInput2 = document.getElementById("taskInput2");
const taskInput3 = document.getElementById("taskInput3");
const taskInput4 = document.getElementById("taskInput4");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Backend API URL
const API_URL = "http://127.0.0.1:8000";

// Function to render tasks
function renderTasks(tasks) {
    taskList.innerHTML = "";
    tasks.forEach(t => {
        const li = document.createElement("li");
        
        // Wrap text inside a span for better styling
        const taskText = document.createElement("span");
        taskText.textContent = `${t.task} (Priority: ${t.priority}) Due Date: ${t.DueDate}`;
        
        // Create remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.classList.add("removeBtn"); // <-- use CSS class

        // Delete handler
        removeBtn.addEventListener("click", async () => {
            try {
                const res = await fetch(`${API_URL}/delete_task`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ task: t.task })
                });
                const data = await res.json();
                renderTasks(data.tasks);
            } catch (err) {
                console.error("Error deleting task:", err);
            }
        });

        li.appendChild(taskText);
        li.appendChild(removeBtn);
        taskList.appendChild(li);
    });
}

// Fetch tasks from backend on page load
async function loadTasks() {
    try {
        const res = await fetch(`${API_URL}/tasks`);
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {
        console.error(err);
        taskList.innerHTML = "<li>Error loading tasks</li>";
    }
}

// Add task and render immediately
addBtn.addEventListener("click", async () => {
    const task1 = taskInput1.value.trim();
    let task2 = parseInt(taskInput2.value.trim()) || 1;
    let task3 = taskInput3.value.trim();
    let task4 = taskInput4.value.trim();
    task2 = Math.min(Math.max(task2, 1), 10); // ensure 1-10
    if (task1 !== "") {
        try {
            const res = await fetch(`${API_URL}/add_task`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task: task1, priority: task2 ,DueDate : task3,dependency : task4})
            });
            const data = await res.json();
            renderTasks(data.tasks); // immediately update UI
            taskInput1.value = "";
            taskInput2.value = "";
            taskInput3.value = "";
            taskInput4.value = "";
        } catch (err) {
            console.error(err);
        }
    }
});

// Load tasks when page opens
loadTasks();
