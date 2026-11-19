from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.driver_grant import DriverGrant


@dataclass(frozen=True)
class UseGrant(Command[DriverGrant]):
    """Marks a grant (a skip, a permission) as spent on the action it passed, by the event that spent it."""

    lock = True

    grant_id: int
    event_id: str = ""
