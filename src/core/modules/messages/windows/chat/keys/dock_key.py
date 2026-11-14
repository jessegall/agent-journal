from engine.viewer.window_key import WindowKey


class DockKey(WindowKey):
    """The dock.* data of the messages.chat window."""

    name = "dock.*"
    read = "dock-item read {id}"
    answered_line = True
