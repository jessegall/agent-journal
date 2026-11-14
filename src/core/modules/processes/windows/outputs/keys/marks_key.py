from engine.viewer.window_key import WindowKey


class MarksKey(WindowKey):
    """The marks data of the processes.outputs window."""

    name = "marks"
    read = "unreadable-mark list"
    events = ["unreadable_mark.*"]
