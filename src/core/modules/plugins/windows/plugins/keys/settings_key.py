from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class SettingsKey(WindowKey):
    """The settings.* data of the plugins.plugins window."""

    name = "settings.*"
    read = "plugin settings {id}"
    name_ids = True
    loading = KeyLoading.REQUESTED
