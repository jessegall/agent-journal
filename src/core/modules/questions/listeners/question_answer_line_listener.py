from engine.command.context import Context
from engine.driver.nudger import Nudger
from engine.event.moved import Moved
from engine.listener.save_listener import SaveListener
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle
from core.modules.questions.models.question import Question
from core.modules.questions.support.question_nudges import QUESTION_ANSWER_SOURCE, QUESTION_ANSWERED, QUESTION_CLOSED
from core.modules.waits.models.wait_target import WaitTarget

ANSWER_SOURCE = "questions.answered"
CLOSED_SOURCE = "questions.closed"


class QuestionAnswerLineListener(SaveListener[Moved[Question]]):
    """Tells the agent that asked a question that it is answered or closed, the moment it is: an idle agent is
    woken by the line and a working one reads it on its next tool call. A question a wait is open on is told by
    that wait instead."""

    name = "questions.answer-line"
    moves = (QuestionLifecycle.answer, QuestionLifecycle.close)
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    def handle(self, event: Moved[Question], context: Context) -> None:
        question = event.row
        if self.has_open_wait(question):
            return
        if event.required_move is QuestionLifecycle.close:
            self.nudger.send(question.session_agent_id, QUESTION_CLOSED, CLOSED_SOURCE, context, question=question.id)
            return
        self.nudger.send(question.session_agent_id, QUESTION_ANSWERED, ANSWER_SOURCE, context, question=question.id)
        if question.message_id is not None:
            self.nudger.send(question.session_agent_id, QUESTION_ANSWER_SOURCE, ANSWER_SOURCE, context, question=question.id, message=question.message_id,
                             reference=f"question:{question.id} message:{question.message_id}")

    def has_open_wait(self, question: Question) -> bool:
        return self.queries.query(WaitTarget).filter(row_table="questions", row_id=question.id).matching(IsNull("resolved_at")).first() is not None
