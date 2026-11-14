from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.refusal_skip import RefusalSkip


@dataclass(frozen=True)
class JudgeRefusalSkip(Command[RefusalSkip]):
    """A main agent's or a user's answer to a confirmed skip of a helper: approved or declined."""

    skip_id: int
    is_approved: bool
