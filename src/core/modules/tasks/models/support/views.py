OPEN_DEPENDENCIES_SELECT = (
    "SELECT task_dependencies.id, task_dependencies.task_id, task_dependencies.dependency_id"
    " FROM task_dependencies"
    " JOIN tasks ON tasks.id = task_dependencies.dependency_id"
    " WHERE tasks.closed_at IS NULL"
)
