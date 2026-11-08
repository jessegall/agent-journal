from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.permission_request import PermissionRequest


@dataclass(frozen=True)
class AskPermission(Command[PermissionRequest]):
    """Asks for leave to do one thing, the command or file named, with the reason; a person is asked when the
    action needs one."""

    action: str
    reason: str
    needs_person: bool = False
