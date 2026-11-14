from engine.viewer.window_key import WindowKey


class DocksKey(WindowKey):
    """The docks data of the messages.chat window."""

    name = "docks"
    read = "dock-item main"
    events = ["dock_item.*"]
