from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.questions.models.enums.question_state import QuestionState


class QuestionLifecycle(Lifecycle):
    states = QuestionState
    initial = [QuestionState.OPEN]
    editable = (QuestionState.OPEN,)
    deletable = (QuestionState.ANSWERED, QuestionState.CLOSED)

    answer = Move("answer", [QuestionState.OPEN], QuestionState.ANSWERED)
    close = Move("close", [QuestionState.OPEN], QuestionState.CLOSED)
