from engine.viewer.window_key import WindowKey


class ChecksKey(WindowKey):
    """The checks data of the checks.checks window."""

    name = "checks"
    read = "check list"
    events = ["check.*"]
