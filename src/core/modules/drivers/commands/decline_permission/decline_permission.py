from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.permission_request import PermissionRequest


@dataclass(frozen=True)
class DeclinePermission(Command[PermissionRequest]):
    """Refuses the one thing of an agent's request; the agent stays refused."""

    request_id: int
