from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class LimitsKey(WindowKey):
    """The agents' limits, read when asked."""

    name = "limits"
    read = "agent limits"
    loading = KeyLoading.REQUESTED
    events = ["agent.*", "setting.*"]
