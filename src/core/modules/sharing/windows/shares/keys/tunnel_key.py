from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class TunnelKey(WindowKey):
    """The tunnel data of the sharing.shares window."""

    name = "tunnel"
    read = "tunnel status"
    loading = KeyLoading.REQUESTED
