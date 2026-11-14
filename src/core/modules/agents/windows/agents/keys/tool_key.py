from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class ToolKey(WindowKey):
    """The tool data of the agents.agents window."""

    name = "tool"
    read = "usage tool"
    loading = KeyLoading.REQUESTED
    arguments = ["agent"]
