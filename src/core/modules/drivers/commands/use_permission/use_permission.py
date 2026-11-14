from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.permission_request import PermissionRequest


@dataclass(frozen=True)
class UsePermission(Command[PermissionRequest]):
    """Marks an allowed request as used by the run it let through, so a second run is refused."""

    request_id: int
