from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.driver_grant import DriverGrant


@dataclass(frozen=True)
class DeclinePermission(Command[DriverGrant]):
    """Refuses the one thing of an agent's request; the agent stays refused."""

    request_id: int
