from engine.viewer.window_key import WindowKey


class MarkListKey(WindowKey):
    """The marks data of the messages.chat window."""

    name = "marks"
    read = "chat-mark main"
    events = ["chat_mark.*"]
    arguments = ["limit", "before-id", "after-id", "ids"]
    page_size = 50
