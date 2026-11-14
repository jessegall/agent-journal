from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class KeywordsKey(WindowKey):
    """The keywords.* data of the memories.memory-facts window."""

    name = "keywords.*"
    read = "memory-keyword list --memory {id}"
    loading = KeyLoading.REQUESTED
