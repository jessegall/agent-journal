from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.driver_grant import DriverGrant


@dataclass(frozen=True)
class AnswerRefusalSkip(Command[DriverGrant]):
    """The agent's final answer to its held skip: confirmed, with what it tried instead, or withdrawn."""

    skip_id: int
    is_confirmed: bool
    tried: str = ""
