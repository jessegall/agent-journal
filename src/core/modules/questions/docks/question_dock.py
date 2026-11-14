from engine.chat.dock_declaration import DockDeclaration
from core.modules.questions.models.enums.question_dock_type import QuestionDockType


class QuestionDock(DockDeclaration):
    """The dock of QuestionDockType.QUESTION."""

    type = QuestionDockType.QUESTION
    icon = "questions"
    title = "{row_title}"
    body = "question-dock.js"
    most = 6
    reads = ["question show"]
