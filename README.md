# Task-Prioritiser
Task-Sensi implementation using bfs/dfs and A* algorithm

✨ Key Features
1. Dependency Management: Models tasks and their prerequisites as a Directed Acyclic Graph (DAG) to ensure a valid workflow.
2. Dynamic Priority Scoring: Calculates a task's priority based on user-defined Importance, upcoming Deadlines (Urgency), and estimated Effort.
3. 🧠 Hybrid Prioritization Logic: Combines a topological sort (to find what can be done) with a priority scoring model (to find what should be done).
4. Optimal "Next Task" Suggestion: The output isn't just a list; it's the most logical and efficient sequence for completing your project.
5. Data-Driven: Define your tasks in a simple, clean JSON file, separating your project data from the application logic.

⚙️ How It Works
1. The prioritizer uses a two-stage hybrid approach to determine the optimal task sequence:

2. Identify Available Tasks: The algorithm first performs a topological sort (specifically, Kahn's Algorithm) on the task graph. This produces a "ready queue" containing all tasks whose prerequisites have been met.

3. Prioritize and Select: It then iterates through the tasks in the ready_queue and calculates a real-time priority score for each one using a weighted formula. The task with the highest score is selected as the next one to complete.

4. Update and Repeat: The selected task is added to the final ordered list. The algorithm then updates the dependencies of the remaining tasks, potentially adding new tasks to the ready_queue. This loop continues until all tasks are scheduled.
