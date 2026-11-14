from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from suites.coding.modules.workers.support.skeletons import WORKERS_WORKTREES_SKELETON
from suites.coding.modules.workers.windows.worktrees.keys.worktrees_key import WorktreesKey


class WorktreesWindow(Window):
    """The Worktrees window."""

    name = "workers.worktrees"
    title = "Worktrees"
    entry = "worktrees.js"
    loading = WindowLoading.COMPONENT
    skeleton = WORKERS_WORKTREES_SKELETON
    group = "project"
    icon = WindowIcon.BRANCH
    reads = ["project-worktree list"]
    runs = ["project-worktree remove"]
    keys = [WorktreesKey]
