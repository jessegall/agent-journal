from engine.viewer.window_key import WindowKey


class WorktreesKey(WindowKey):
    """The worktrees data of the workers.worktrees window."""

    name = "worktrees"
    read = "project-worktree list"
