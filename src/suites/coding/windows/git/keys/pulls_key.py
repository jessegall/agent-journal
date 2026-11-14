from engine.viewer.window_key import WindowKey


class PullsKey(WindowKey):
    """The pull requests of the project."""

    name = "pulls"
    read = "git-overview pulls"
