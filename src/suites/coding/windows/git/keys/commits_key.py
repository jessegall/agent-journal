from engine.viewer.window_key import WindowKey


class CommitsKey(WindowKey):
    """The commits of the project, paged."""

    name = "commits"
    read = "git-overview commits"
    arguments = ["skip", "limit"]
