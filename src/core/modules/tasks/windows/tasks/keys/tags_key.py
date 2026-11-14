from engine.viewer.window_key import WindowKey


class TagsKey(WindowKey):
    """The tags data of the tasks.tasks window."""

    name = "tags"
    read = "task tags"
    tab = "list"
    events = ["task_tag.*"]
