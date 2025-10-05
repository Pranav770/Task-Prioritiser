const taskInput1 = document.getElementById("taskInput1");
const taskInput2 = document.getElementById("taskInput2");
const taskInput3 = document.getElementById("taskInput3");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const sortedTaskList = document.getElementById("sortedTaskList");
const dependencyContainer = document.getElementById("dependency-container");
const saveDependenciesBtn = document.getElementById("saveDependencies");
const sortBtn = document.getElementById("sortBtn");


// Backend API URL
const API_URL = "https://task-prioritiser-api.onrender.com";

// Render normal tasks
function renderTasks(tasks) {
    taskList.innerHTML = "";    
    tasks.forEach(t => {
        const li = document.createElement("li");

        const taskText = document.createElement("span");
        taskText.textContent = `${t.task} (Priority: ${t.priority}) Due Date: ${t.DueDate || "N/A"}`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.classList.add("removeBtn");

        removeBtn.addEventListener("click", async () => {
            try {
                const res = await fetch(`${API_URL}/delete_task`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ task: t.task })
                });
                const data = await res.json();
                renderTasks(data.tasks);
                renderDependencyOptions(data.tasks);
                
            } catch (err) {
                console.error("Error deleting task:", err);
            }
        });

        li.appendChild(taskText);
        li.appendChild(removeBtn);
        taskList.appendChild(li);
    });
}

// Render sorted tasks
function renderSortedTasks(tasks) {
    sortedTaskList.innerHTML = "";
    tasks.forEach((t, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${t.task} (Priority: ${t.priority}) Due: ${t.DueDate || "N/A"}`;
        sortedTaskList.appendChild(li);
    });
}

// Fetch tasks from backend
async function loadTasks() {
    try {
        const res = await fetch(`${API_URL}/tasks`);
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const tasks = await res.json();
        renderTasks(tasks);
        renderDependencyOptions(tasks);
    } catch (err) {
        console.error(err);
        taskList.innerHTML = "<li>Error loading tasks</li>";
    }
}

// Fetch sorted tasks from backend
async function loadSortedTasks() {
    try {
        const res = await fetch(`${API_URL}/sorted_tasks`);
        if (!res.ok) throw new Error("Failed to fetch sorted tasks");
        const data = await res.json();
        renderSortedTasks(data.tasks);
    } catch (err) {
        console.error(err);
        sortedTaskList.innerHTML = "<li>Error loading sorted tasks</li>";
    }
}

// Add task
addBtn.addEventListener("click", async () => {
    const task1 = taskInput1.value.trim();
    let task2 = parseInt(taskInput2.value.trim()) || 1;
    let task3 = taskInput3.value.trim();
    let dueDate = "";
    if (task3) {
        const [year, month, day] = task3.split("-");
        dueDate = `${day}/${month}/${year}`;
    }
    task2 = Math.min(Math.max(task2, 1), 10);

    if (task1 !== "") {
        try {
            const res = await fetch(`${API_URL}/add_task`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    task: task1,
                    priority: task2,
                    DueDate: dueDate
                })
            });
            const data = await res.json();
            renderTasks(data.tasks);
            renderDependencyOptions(data.tasks);
            

            // Clear inputs
            taskInput1.value = "";
            taskInput2.value = "";
            taskInput3.value = "";
        } catch (err) {
            console.error(err);
        }
    }
});

// Render dependency dropdowns for each task
function renderDependencyOptions(tasks) {
    dependencyContainer.innerHTML = "";
    tasks.forEach(task => {
        const div = document.createElement("div");
        div.style.marginBottom = "10px";

        div.innerHTML = `
            <label>${task.id} depends on:</label>
            <select data-task-id="${task.id}" multiple>
                ${tasks
                    .filter(t => t.id !== task.id)
                    .map(t => `
                        <option value="${t.id}" ${
                            Array.isArray(task.dependency) && task.dependency.includes(t.id)
                                ? "selected"
                                : ""
                        }>
                            ${t.id}
                        </option>
                    `).join("")}
            </select>
        `;
        dependencyContainer.appendChild(div);
    });
}

// Save dependencies
saveDependenciesBtn.addEventListener("click", async () => {
    const selects = document.querySelectorAll("#dependency-container select");
    const updates = [];

    selects.forEach(sel => {
        const taskId = sel.dataset.taskId;
        const selectedOptions = Array.from(sel.selectedOptions).map(opt => opt.value);
updates.push({
    id: taskId,
    dependency: selectedOptions.length > 0 ? selectedOptions : []
});

    });

    try {
        const res = await fetch(`${API_URL}/update_dependencies`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ updates })
        });
        const data = await res.json();
        renderTasks(data.tasks);
        renderDependencyOptions(data.tasks);
        
    } catch (err) {
        console.error(err);
    }
});

    // Show sorted tasks only when button is clicked
    sortBtn.addEventListener("click", () => {
    loadSortedTasks();
    });

// Load everything on page start
loadTasks();

