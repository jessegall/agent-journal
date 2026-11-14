from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class PreviewKey(WindowKey):
    """The preview data of the plugins.plugins window."""

    name = "preview"
    read = "plugin preview {source}"
    loading = KeyLoading.REQUESTED
