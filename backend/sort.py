from collections import deque
from datetime import datetime

def constructAdj(V, edges):
    adj = [[] for _ in range(V)]
    for u, v in edges:
        adj[u].append(v)
    return adj

def topologicalSort(V, edges, tasks):
    adj = constructAdj(V, edges)
    indegree = [0] * V

    # Calculate indegree of each vertex
    for u in range(V):
        for v in adj[u]:
            indegree[v] += 1

    # Custom comparator: sort by priority first, then by due date
    def task_sort_key(idx):
        priority = tasks[idx].get("priority", 0)
        due_date_str = tasks[idx].get("DueDate")
        due_date = datetime.strptime(due_date_str, "%d/%m/%Y").date() if due_date_str else datetime.max.date()
        return (-priority, due_date)  # higher priority first, earlier due date first

    # Start with tasks that have indegree 0
    ready = [i for i in range(V) if indegree[i] == 0]
    ready.sort(key=task_sort_key)  # sort initially

    result = []
    while ready:
        node = ready.pop(0)  # pick best task (highest priority, earliest deadline)
        result.append(node)

        for neighbor in adj[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                ready.append(neighbor)

        # Re-sort available tasks after each insertion
        ready.sort(key=task_sort_key)

    if len(result) != V:
        print("⚠️ Graph contains cycle (circular dependency detected)!")
        return []

    return result

# ✅ Function to run with your tasks.json
def run_topological_sort(tasks):
    id_to_index = {task["id"]: idx for idx, task in enumerate(tasks)}
    index_to_task = {idx: task for idx, task in enumerate(tasks)}

    edges = []
    for task in tasks:
        deps = task.get("dependency", [])
        if isinstance(deps, str):  # in case it's a single dependency
            deps = [deps]
        for dep_id in deps:
            if dep_id in id_to_index:
                edges.append([id_to_index[dep_id], id_to_index[task["id"]]])


    order = topologicalSort(len(tasks), edges, tasks)

    sorted_tasks = []
    for idx in order:
        task = index_to_task[idx].copy()
        task.pop("id", None)
        task.pop("dependency", None)
        sorted_tasks.append(task)


    return sorted_tasks
