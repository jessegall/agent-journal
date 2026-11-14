from engine.enums.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.questions.models.enums.question_mark_type import QuestionMarkType
from core.modules.questions.models.enums.question_mark_variant import QuestionMarkVariant

QUESTIONS_FAMILY = MarkFamily("questions.questions", "Questions", "question", MarkGroup.AGENT)

QUESTION_MARKS = [MarkDeclaration(QuestionMarkType.QUESTION, QuestionMarkVariant, QUESTIONS_FAMILY, "Question", "question", click=MarkClick.OPEN_ROW, process=True, body="question-card.js", card=True),
                  MarkDeclaration(QuestionMarkType.ANSWER, QuestionMarkVariant, QUESTIONS_FAMILY, "Question answered", "question", click=MarkClick.OPEN_ROW)]

