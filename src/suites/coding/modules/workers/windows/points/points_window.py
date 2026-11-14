from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_shows import WindowShows
from suites.coding.modules.workers.support.skeletons import WORKERS_POINTS_SKELETON
from suites.coding.modules.workers.windows.points.keys.points_key import PointsKey


class PointsWindow(Window):
    """The Brief points window."""

    name = "workers.points"
    title = "Brief points"
    entry = "points.js"
    loading = WindowLoading.COMPONENT
    skeleton = WORKERS_POINTS_SKELETON
    icon = WindowIcon.CHECK
    shows = WindowShows.SELECTED_AGENT
    reads = ["worker-worktree points", "proof points"]
    events = ["proof.*", "worker_worktree.*"]
    keys = [PointsKey]
