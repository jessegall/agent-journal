from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.permission_request import PermissionRequest


@dataclass(frozen=True)
class AllowPermission(Command[PermissionRequest]):
    """Lets the asking agent do the one thing of its request, once."""

    request_id: int
