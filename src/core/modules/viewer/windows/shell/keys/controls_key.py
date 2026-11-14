from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class ControlsKey(WindowKey):
    """The controls data of the viewer.shell window."""

    name = "controls"
    read = "agent controls {agent}"
    loading = KeyLoading.REQUESTED
