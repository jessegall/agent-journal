from engine.viewer.window_key import WindowKey


class LimitsKey(WindowKey):
    """The limits data of the usage.usage window."""

    name = "limits"
    read = "usage-limit list"
    events = ["usage_limit.*"]
