from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.questions.models.question import Question


@dataclass(frozen=True)
class AskQuestion(Command[Question]):
    """Asks the user a question for the calling agent, with the options it offers and the one it recommends."""

    text: str
    options: Sequence[str] = ()
    recommended: str = ""
