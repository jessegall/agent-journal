from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class MainAgentKey(WindowKey):
    """The main-agent data of the messages.chat window."""

    name = "main-agent"
    read = "agent main"
    loading = KeyLoading.REQUESTED
