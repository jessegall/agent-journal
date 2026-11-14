from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class OpensKey(WindowKey):
    """The opens data of the sharing.shares window."""

    name = "opens"
    read = "share opens"
    arguments = ["target"]
    loading = KeyLoading.REQUESTED
