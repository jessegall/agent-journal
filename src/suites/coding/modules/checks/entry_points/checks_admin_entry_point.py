from engine.viewer.entry_point import EntryPoint
from suites.coding.entry_points.admin_entry_point import ADMIN_ENTRY_POINT_KEY
from suites.coding.modules.checks.windows.checks.checks_window import ChecksWindow


class ChecksAdminEntryPoint(EntryPoint):
    """The window the checks module adds to the admin entry point of the coding suite."""

    key = ADMIN_ENTRY_POINT_KEY
    windows = [ChecksWindow]
