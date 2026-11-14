from engine.viewer.window_key import WindowKey


class OpenKey(WindowKey):
    """The open data of the plans.plans window."""

    name = "open"
    read = "plan board"
    tab = "open"
    events = ["plan.*", "phase.*", "task.*"]
    arguments = ["limit"]
