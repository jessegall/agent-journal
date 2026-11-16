from engine.viewer.window_key import WindowKey


class MarkListKey(WindowKey):
    """The marks data of the processes.outputs window."""

    name = "marks"
    read = "unreadable-mark list"
    events = ["unreadable_mark.*"]
