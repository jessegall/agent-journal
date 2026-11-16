from engine.viewer.window_extension import WindowExtension


class ChatActiveAgentsExtension(WindowExtension):
    """The running agents the chat reads to show who works on a plan."""

    window = "messages.chat"
    reads = ["agent running"]
