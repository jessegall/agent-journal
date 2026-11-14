from engine.viewer.window_key import WindowKey


class UsageKey(WindowKey):
    """The usage data of the usage.usage window."""

    name = "usage"
    read = "usage show"
    reload_seconds = 30
