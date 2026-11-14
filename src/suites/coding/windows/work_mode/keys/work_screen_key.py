from engine.viewer.window_key import WindowKey


class WorkScreenKey(WindowKey):
    """The work screen of the settings."""

    name = "work-screen"
    read = "setting-screen show work"
    events = ["setting.*"]
