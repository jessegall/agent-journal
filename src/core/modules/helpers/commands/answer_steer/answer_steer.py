from dataclasses import dataclass

from engine.command.command import Command
from core.modules.helpers.models.helper_steer import HelperSteer


@dataclass(frozen=True)
class AnswerSteer(Command[HelperSteer]):
    """A helper says what it does with a steer its parent added to its job; its parent reads it with the report."""

    steer_id: int
    answer: str
