from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.questions.models.enums.question_mark_type import QuestionMarkType
from core.modules.questions.models.enums.question_mark_variant import QuestionMarkVariant

QUESTIONS_FAMILY = MarkFamily("questions.questions", "Questions", "question", MarkGroup.AGENT)

QUESTION_MARKS = [MarkDeclaration(QuestionMarkType.QUESTION, QuestionMarkVariant, QUESTIONS_FAMILY, "Question", "question", click=MarkClick.OPEN_ROW, process=True)]
