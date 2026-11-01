OPEN_DEPENDENCIES_SELECT = (
    "SELECT task_dependencies.id, task_dependencies.task_id, task_dependencies.dependency_id"
    " FROM task_dependencies"
    " JOIN tasks ON tasks.id = task_dependencies.dependency_id"
    " WHERE tasks.closed_at IS NULL"
)

TASK_CARDS_SELECT = "SELECT id, environment_id, title, state, priority, reason FROM tasks"

TASK_EDGES_SELECT = (
    "SELECT task_id, dependency_id AS waits_on_id FROM task_dependencies"
    " UNION SELECT task_id, CAST(substr(target, 7) AS INTEGER) FROM task_waits WHERE ended_at IS NULL AND target LIKE 'tasks:%'"
)
