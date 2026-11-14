from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class QueueKey(WindowKey):
    """The queue data of the developer.hook-requests window."""

    name = "queue"
    read = "queue list"
    loading = KeyLoading.REQUESTED
