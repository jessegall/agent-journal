from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class MemoriesKey(WindowKey):
    """The memories data of the memories.memories window."""

    name = "memories"
    read = "memory page"
    arguments = ["agent", "environment", "state", "search", "order", "limit"]
    switches = ["main-agent", "other-agents", "removed"]
    events = ["memory.*"]
    loading = KeyLoading.REQUESTED
