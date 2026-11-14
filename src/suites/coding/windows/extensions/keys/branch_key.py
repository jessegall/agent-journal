from engine.viewer.window_key import WindowKey


class BranchKey(WindowKey):
    """The branch the project's checkout is on, read again every thirty seconds."""

    name = "branch"
    read = "git-overview current"
    reload_seconds = 30
