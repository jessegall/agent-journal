from engine.viewer.window_key import WindowKey


class ClosedKey(WindowKey):
    """The closed data of the plans.plans window."""

    name = "closed"
    read = "plan board --closed"
    tab = "closed"
    events = ["plan.*", "phase.*", "task.*"]
    arguments = ["limit"]
