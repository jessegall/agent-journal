from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.driver_grant import DriverGrant


@dataclass(frozen=True)
class AskPermission(Command[DriverGrant]):
    """Asks for leave to do one thing, the command or file named, with the reason; a user is asked when the
    action needs one."""

    lock = True

    action: str
    reason: str
    requires_person: bool = False
