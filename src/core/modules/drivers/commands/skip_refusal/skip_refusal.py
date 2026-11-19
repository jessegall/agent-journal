from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.driver_grant import DriverGrant


@dataclass(frozen=True)
class SkipRefusal(Command[DriverGrant]):
    """Passes the refusal of one rule or guard that just refused the agent, saying why; a guard's skip is used
    at once."""

    lock = True

    name: str
    reason: str
    is_used: bool = False
