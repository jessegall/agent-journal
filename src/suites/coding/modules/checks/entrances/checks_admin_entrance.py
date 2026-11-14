from engine.viewer.entrance import Entrance
from suites.coding.entrances.admin_entrance import ADMIN_ENTRANCE_KEY
from suites.coding.modules.checks.windows.checks.checks_window import ChecksWindow


class ChecksAdminEntrance(Entrance):
    """The window the checks module adds to the admin entrance of the coding suite."""

    key = ADMIN_ENTRANCE_KEY
    windows = [ChecksWindow]
