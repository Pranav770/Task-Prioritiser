from datetime import datetime
from collections import deque, defaultdict

def run_hybrid_prioritization(tasks):
    """
    Hybrid task prioritization using BFS-based topological sort (Kahn's Algorithm).
    
    Steps:
    1. Build in-degree map and adjacency list (task dependencies).
    2. Initialize a queue with tasks having no prerequisites.
    3. Process tasks in BFS order:
        - At each step, choose the highest scoring task from the current queue.
        - Append it to the result.
        - Reduce the in-degree of its neighbors.
        - If any neighbor's in-degree hits 0, enqueue it.
    4. Return the prioritized task order.
    """

    # Map task_id -> task dictionary
    task_map = {task["id"]: task for task in tasks}

    # Build graph and in-degree map
    in_degree = {task["id"]: 0 for task in tasks}
    graph = defaultdict(list)

    for task in tasks:
        for prereq in task["prerequisites"]:
            graph[prereq].append(task["id"])
            in_degree[task["id"]] += 1

    # Function to compute hybrid score
    def compute_score(task):
        importance = task["importance"]
        due_date = datetime.strptime(task["due_date"], "%Y-%m-%d").date()
        today = datetime.today().date()
        days_until_due = max((due_date - today).days, 0)  # no negatives
        return (importance * 10) + (100 - days_until_due)

    # Initialize BFS queue with tasks having no prerequisites
    queue = deque([tid for tid, deg in in_degree.items() if deg == 0])
    result = []

    while queue:
        # Get all available tasks in the current "frontier"
        current_level = [task_map[tid] for tid in list(queue)]
        queue.clear()

        # Pick the task with the highest score
        best_task = max(current_level, key=compute_score)
        result.append(best_task)

        # Process only the chosen best task
        for neighbor in graph[best_task["id"]]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # Optional: cycle detection (if not all tasks are processed)
    if len(result) != len(tasks):
        raise ValueError("Cycle detected in task dependencies!")

    return result
