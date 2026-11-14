from engine.viewer.window_extension import WindowExtension


class ChatTemplatesExtension(WindowExtension):
    """The templates the chat reads to offer them."""

    window = "messages.chat"
    reads = ["template list"]
