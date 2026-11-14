from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class OlderOpenKey(WindowKey):
    """The older-open data of the plans.plans window."""

    name = "older-open"
    read = "plan board"
    loading = KeyLoading.REQUESTED
    arguments = ["before-id"]
