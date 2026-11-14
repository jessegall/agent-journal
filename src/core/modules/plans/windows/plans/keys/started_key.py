from engine.viewer.window_key import WindowKey


class StartedKey(WindowKey):
    """The started data of the plans.plans window."""

    name = "started"
    read = "plan board --started"
    tab = "started"
    events = ["plan.*", "phase.*", "task.*"]
    arguments = ["limit"]
