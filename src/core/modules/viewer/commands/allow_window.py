from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.viewer.models.window_permission import WindowPermission
from core.modules.viewer.models.enums.window_permission_type import WindowPermissionType


@dataclass(frozen=True)
class AllowWindow(Command[WindowPermission]):
    """Allows a window, for the caller in the caller's environment, every read or command line it declares now."""

    window: str
    type: WindowPermissionType
