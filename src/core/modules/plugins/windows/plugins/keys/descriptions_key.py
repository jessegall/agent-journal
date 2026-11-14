from engine.viewer.window_key import WindowKey


class DescriptionsKey(WindowKey):
    """The descriptions data of the plugins.plugins window."""

    name = "descriptions"
    read = "plugin descriptions"
    events = ["plugin.*"]
