from engine.viewer.window_key import WindowKey


class AdvancedScreenKey(WindowKey):
    """The advanced screen of the settings."""

    name = "advanced-screen"
    read = "setting-screen show advanced"
    events = ["setting.*"]
