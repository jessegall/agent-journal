from engine.viewer.window_key import WindowKey


class ActivityKey(WindowKey):
    """The activity data of the viewer.shell window."""

    name = "activity"
    read = "event list --limit 30"
    tab = "activity"
    reload_seconds = 5
