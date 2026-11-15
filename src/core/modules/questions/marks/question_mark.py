from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.questions.models.enums.question_mark_type import QuestionMarkType
from core.modules.questions.models.enums.question_mark_variant import QuestionMarkVariant
from core.modules.questions.support.question_marks import QUESTIONS_FAMILY


class QuestionMark(MarkDeclaration):
    """The mark QuestionMarkType.QUESTION."""

    type = QuestionMarkType.QUESTION
    variants = QuestionMarkVariant
    family = QUESTIONS_FAMILY
    label = "Question"
    mark_icon = "question"
    click = MarkClick.OPEN_ROW
    process = True
    body = "question-card.js"
    card = True
