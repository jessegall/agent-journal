from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class LatestKey(WindowKey):
    """The latest data of the processes.output window."""

    name = "latest"
    read = "process feed --limit 1"
    arguments = ["session-agent-id"]
    loading = KeyLoading.REQUESTED
