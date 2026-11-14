from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class OlderClosedKey(WindowKey):
    """The older-closed data of the plans.plans window."""

    name = "older-closed"
    read = "plan board --closed"
    loading = KeyLoading.REQUESTED
    arguments = ["before-id"]
