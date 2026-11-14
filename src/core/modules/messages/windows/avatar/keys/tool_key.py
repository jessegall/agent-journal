from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class ToolKey(WindowKey):
    """The tool data of the messages.avatar window."""

    name = "tool"
    read = "usage tool"
    reload_seconds = 5
    loading = KeyLoading.AFTER_WINDOW
