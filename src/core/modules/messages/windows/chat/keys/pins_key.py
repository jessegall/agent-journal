from engine.viewer.window_key import WindowKey


class PinsKey(WindowKey):
    """The pins data of the messages.chat window."""

    name = "pins"
    read = "pin list"
    events = ["pin.*"]
