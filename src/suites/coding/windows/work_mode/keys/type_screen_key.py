from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class TypeScreenKey(WindowKey):
    """The settings screen of one helper type, read when asked."""

    name = "type-screen"
    read = "setting-screen show helper-type"
    arguments = ["type"]
    loading = KeyLoading.REQUESTED
    events = ["setting.*"]
