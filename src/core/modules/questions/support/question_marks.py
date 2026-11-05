from core.base.chat.dock_declaration import DockDeclaration
from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.questions.models.enums.question_dock_type import QuestionDockType
from core.modules.questions.models.enums.question_mark_type import QuestionMarkType
from core.modules.questions.models.enums.question_mark_variant import QuestionMarkVariant

QUESTIONS_FAMILY = MarkFamily("questions.questions", "Questions", "question", MarkGroup.AGENT)

QUESTION_MARKS = [MarkDeclaration(QuestionMarkType.QUESTION, QuestionMarkVariant, QUESTIONS_FAMILY, "Question", "question", click=MarkClick.OPEN_ROW, process=True, body="question-card.js", card=True),
                  MarkDeclaration(QuestionMarkType.ANSWER, QuestionMarkVariant, QUESTIONS_FAMILY, "Question answered", "question", click=MarkClick.OPEN_ROW)]

QUESTION_DOCKS = [DockDeclaration(QuestionDockType.QUESTION, "questions", "{row_title}", "question-dock.js", most=6, reads=["question show"]),
                  DockDeclaration(QuestionDockType.OPEN, "questions", "Agent asked questions", "open-questions-dock.js", draws_head=True, needs_user=True, reads=["question list"])]
