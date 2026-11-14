from engine.viewer.window_key import WindowKey


class WorkKey(WindowKey):
    """The work settings."""

    name = "work"
    read = "work-settings show"
    events = ["setting.*"]
