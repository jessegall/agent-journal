from engine.viewer.window_key import WindowKey


class NudgesKey(WindowKey):
    """The nudges data of the drivers.nudges window."""

    name = "nudges"
    read = "nudge list"
    events = ["nudge_record.*"]
