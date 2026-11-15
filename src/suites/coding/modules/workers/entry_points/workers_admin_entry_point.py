from engine.viewer.entry_point import EntryPoint
from suites.coding.entry_points.admin_entry_point import ADMIN_ENTRY_POINT_KEY
from suites.coding.modules.workers.windows.workers.workers_window import WorkersWindow
from suites.coding.modules.workers.windows.worktrees.worktrees_window import WorktreesWindow
from suites.coding.modules.workers.windows.points.points_window import PointsWindow
from suites.coding.modules.workers.windows.todos.todos_window import TodosWindow


class WorkersAdminEntryPoint(EntryPoint):
    """The windows the workers module adds to the admin entry point of the coding suite."""

    key = ADMIN_ENTRY_POINT_KEY
    windows = [WorkersWindow, WorktreesWindow, PointsWindow, TodosWindow]
