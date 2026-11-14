from engine.viewer.window_key import WindowKey


class HelperTypesScreenKey(WindowKey):
    """The helper type screen of the settings."""

    name = "helper-types-screen"
    read = "setting-screen show helper-type"
    events = ["setting.*"]
