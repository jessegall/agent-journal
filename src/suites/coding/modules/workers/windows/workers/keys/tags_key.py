from engine.viewer.window_key import WindowKey


class TagsKey(WindowKey):
    """The tags data of the workers.workers window."""

    name = "tags"
    read = "task tags"
    tab = "split"
    events = ["task_tag.*"]
