from engine.viewer.window_key import WindowKey


class BoardKey(WindowKey):
    """The board data of the tasks.tasks window."""

    name = "board"
    read = "task board"
    tab = "list"
    arguments = ["limit", "tag", "hide-plan-tasks"]
    events = ["task.*", "task_tag.*", "task_wait.*"]
