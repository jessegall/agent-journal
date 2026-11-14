from engine.viewer.window_key import WindowKey


class MessagesKey(WindowKey):
    """The messages data of the messages.chat window."""

    name = "messages"
    read = "message feed"
    events = ["message.*"]
    arguments = ["limit", "before-id", "after-id", "ids"]
    page_size = 50
