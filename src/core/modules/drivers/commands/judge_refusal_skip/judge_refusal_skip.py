from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.driver_grant import DriverGrant


@dataclass(frozen=True)
class JudgeRefusalSkip(Command[DriverGrant]):
    """A main agent's or a user's answer to a confirmed skip of a helper: approved or declined."""

    skip_id: int
    is_approved: bool
