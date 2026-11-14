from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class KeywordsKey(WindowKey):
    """The keywords.* data of the memories.memories window."""

    name = "keywords.*"
    read = "memory-keyword list --memory {id}"
    events = ["memory_keyword.*"]
    loading = KeyLoading.REQUESTED
