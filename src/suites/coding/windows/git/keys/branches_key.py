from engine.viewer.window_key import WindowKey


class BranchesKey(WindowKey):
    """The branches of the project, paged."""

    name = "branches"
    read = "git-overview branches"
    arguments = ["skip", "limit"]
