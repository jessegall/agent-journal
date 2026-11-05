from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle
from core.modules.questions.models.question import Question

OPEN = Question(id=1, version=1, environment_id=1, session_agent_id=2, creator_id=2, text="Which database?", options=("sqlite", "postgres"), recommended="sqlite")


def test_a_question_opens_and_moves_to_answered_or_closed():
    assert OPEN.state is QuestionState.OPEN
    assert OPEN.moved(QuestionLifecycle.answer, answer="sqlite").state is QuestionState.ANSWERED
    assert OPEN.moved(QuestionLifecycle.close).state is QuestionState.CLOSED


def test_an_answered_question_cannot_be_answered_or_closed_again():
    answered = OPEN.moved(QuestionLifecycle.answer, answer="sqlite")
    assert QuestionLifecycle.outgoing_moves(answered.state) == ()


def test_only_an_open_question_is_editable_and_only_a_finished_one_deletable():
    assert QuestionLifecycle.editable == [QuestionState.OPEN]
    assert QuestionLifecycle.deletable == (QuestionState.ANSWERED, QuestionState.CLOSED)
