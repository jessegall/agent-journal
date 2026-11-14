from engine.viewer.window_key import WindowKey


class MarkMotionKey(WindowKey):
    """The mark-motion data of the messages.chat window."""

    name = "mark-motion"
    read = "setting show journal.core.developer.tools.mark-motion"
    events = ["setting.*"]
