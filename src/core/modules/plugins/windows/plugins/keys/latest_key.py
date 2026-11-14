from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class LatestKey(WindowKey):
    """The latest.* data of the plugins.plugins window."""

    name = "latest.*"
    read = "plugin latest {id}"
    name_ids = True
    loading = KeyLoading.REQUESTED
