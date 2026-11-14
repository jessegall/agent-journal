from engine.chat.dock_declaration import DockDeclaration
from core.modules.questions.models.enums.question_dock_type import QuestionDockType


class OpenDock(DockDeclaration):
    """The dock of QuestionDockType.OPEN."""

    type = QuestionDockType.OPEN
    icon = "questions"
    title = "Agent asked questions"
    body = "open-questions-dock.js"
    draws_head = True
    needs_user = True
    reads = ["question list"]
