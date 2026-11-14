from engine.viewer.window_key import WindowKey


class PluginsKey(WindowKey):
    """The plugins data of the plugins.plugins window."""

    name = "plugins"
    read = "plugin list"
    events = ["plugin.*"]
