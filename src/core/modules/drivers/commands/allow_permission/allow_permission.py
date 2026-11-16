from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.driver_grant import DriverGrant


@dataclass(frozen=True)
class AllowPermission(Command[DriverGrant]):
    """Lets the asking agent do the one thing of its request, once."""

    request_id: int
