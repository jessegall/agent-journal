from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.viewer.window_permission import WindowPermission
from core.modules.viewer.window_permission_type import WindowPermissionType


@dataclass(frozen=True)
class WindowAllow(Command[WindowPermission]):
    """Allows a window, for the caller in the caller's environment, every read or command line it declares now."""

    window: str
    type: WindowPermissionType
