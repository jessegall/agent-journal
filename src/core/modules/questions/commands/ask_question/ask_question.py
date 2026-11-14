from collections.abc import Sequence
from dataclasses import dataclass

from engine.command.command import Command
from core.modules.questions.models.question import Question
from core.modules.questions.support.question_place import QuestionPlace


@dataclass(frozen=True)
class AskQuestion(Command[Question]):
    """Asks the user a question for the calling agent: a short title, the context that lets it be read on its own,
    the options it offers and the one it recommends."""

    text: str
    context: str
    options: Sequence[str] = ()
    recommended: str = ""
    place: QuestionPlace = QuestionPlace()
