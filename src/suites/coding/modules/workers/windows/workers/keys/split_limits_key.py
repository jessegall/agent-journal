from engine.viewer.window_key import WindowKey


class SplitLimitsKey(WindowKey):
    """The split-limits data of the workers.workers window."""

    name = "split-limits"
    read = "agent limits"
    tab = "split"
    events = ["setting.*", "agent.*"]
