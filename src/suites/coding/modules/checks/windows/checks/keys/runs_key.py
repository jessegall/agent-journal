from engine.viewer.window_key import WindowKey


class RunsKey(WindowKey):
    """The runs.* data of the checks.checks window."""

    name = "runs.*"
    read = "check runs {id}"
