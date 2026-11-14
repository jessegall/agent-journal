from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class PinsKey(WindowKey):
    """The pins data of the viewer.shell window."""

    name = "pins"
    read = "pin list"
    loading = KeyLoading.REQUESTED
