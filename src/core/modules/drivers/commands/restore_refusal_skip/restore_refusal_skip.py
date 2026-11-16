from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.driver_grant import DriverGrant


@dataclass(frozen=True)
class RestoreRefusalSkip(Command[DriverGrant]):
    """Gives an agent its skip back after it lost it."""

    agent_id: int
