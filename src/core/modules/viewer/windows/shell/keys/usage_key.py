from engine.viewer.window_key import WindowKey


class UsageKey(WindowKey):
    """The usage data of the viewer.shell window."""

    name = "usage"
    read = "usage show --open"
    reload_seconds = 10
