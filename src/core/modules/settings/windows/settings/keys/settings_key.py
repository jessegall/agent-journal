from engine.viewer.window_key import WindowKey


class SettingsKey(WindowKey):
    """The settings data of the settings.settings window."""

    name = "settings"
    read = "setting tree"
    tab = "settings"
    events = ["setting.*"]
