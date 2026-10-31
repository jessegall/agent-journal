from core.base.chat.dock_declaration import DockDeclaration
from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.questions.models.enums.question_dock_type import QuestionDockType
from core.modules.questions.models.enums.question_mark_type import QuestionMarkType
from core.modules.questions.models.enums.question_mark_variant import QuestionMarkVariant

QUESTIONS_FAMILY = MarkFamily("questions.questions", "Questions", "question", MarkGroup.AGENT)

QUESTION_MARKS = [MarkDeclaration(QuestionMarkType.QUESTION, QuestionMarkVariant, QUESTIONS_FAMILY, "Question", "question", click=MarkClick.OPEN_ROW, process=True)]

QUESTION_DOCKS = [DockDeclaration(QuestionDockType.QUESTION, "question", "Question {row_id}", "question-dock.js", most=6, reads=["question show"])]
