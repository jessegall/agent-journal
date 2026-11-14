from dataclasses import dataclass

from engine.command.move_command import MoveCommand
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle
from core.modules.questions.models.question import Question


@dataclass(frozen=True)
class CloseQuestion(MoveCommand[Question]):
    move = QuestionLifecycle.close
