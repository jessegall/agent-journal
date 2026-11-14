from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class SelectionKey(WindowKey):
    """The selection data of the processes.output window."""

    name = "selection"
    read = "window setting processes.output output"
    loading = KeyLoading.REQUESTED
