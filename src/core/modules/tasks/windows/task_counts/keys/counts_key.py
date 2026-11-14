from engine.viewer.window_key import WindowKey


class CountsKey(WindowKey):
    """The counts data of the tasks.task-counts window."""

    name = "counts"
    read = "task counts"
    arguments = ["hours", "since"]
    events = ["task.*"]
