from engine.viewer.window_key import WindowKey


class TodosKey(WindowKey):
    """The todos data of the workers.todos window."""

    name = "todos"
    read = "todo-item list --oldest"
    arguments = ["agent"]
    events = ["todo_item.*"]
