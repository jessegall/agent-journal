from engine.viewer.entrance import Entrance
from suites.coding.entrances.admin_entrance import ADMIN_ENTRANCE_KEY
from suites.coding.modules.workers.windows.workers.workers_window import WorkersWindow
from suites.coding.modules.workers.windows.worktrees.worktrees_window import WorktreesWindow
from suites.coding.modules.workers.windows.points.points_window import PointsWindow
from suites.coding.modules.workers.windows.todos.todos_window import TodosWindow


class WorkersAdminEntrance(Entrance):
    """The windows the workers module adds to the admin entrance of the coding suite."""

    key = ADMIN_ENTRANCE_KEY
    windows = [WorkersWindow, WorktreesWindow, PointsWindow, TodosWindow]
