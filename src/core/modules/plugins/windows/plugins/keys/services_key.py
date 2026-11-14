from engine.viewer.window_key import WindowKey


class ServicesKey(WindowKey):
    """The services data of the plugins.plugins window."""

    name = "services"
    read = "plugin services"
    events = ["plugin.*"]
    reload_seconds = 15
