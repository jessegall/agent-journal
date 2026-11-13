from engine.command.context import Context
from engine.driver.nudger import Nudger
from engine.event.moved import Moved
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle
from core.modules.questions.models.question import Question
from core.modules.questions.support.question_nudges import QUESTION_ANSWER_SOURCE, QUESTION_ANSWERED, QUESTION_CLOSED
from core.modules.waits.listeners.wait_end_listener import WORK_CONTINUED
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait import Wait
from core.modules.waits.models.wait_target import WaitTarget

ANSWER_SOURCE = "questions.answered"
CLOSED_SOURCE = "questions.closed"


class QuestionAnswerLineListener(SaveListener[Moved[Question]]):
    """Tells the agent that asked a question that it is answered or closed, the moment it is. A wait
    still open on the question, or one this answer ends, wakes the agent itself, so the line then
    only reaches it on its next tool call; otherwise, with every earlier wait long ended, the line
    wakes an idle agent. A working agent reads it on its next tool call."""

    name = "questions.answer-line"
    moves = (QuestionLifecycle.answer, QuestionLifecycle.close)
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    def handle(self, event: Moved[Question], context: Context) -> None:
        question = event.row
        wakes_agent = not self.has_waking_wait(question, context)
        if event.required_move is QuestionLifecycle.close:
            self.nudger.send_nudge(question.session_agent_id, QUESTION_CLOSED.nudge(question=question.id), CLOSED_SOURCE, context, wakes_agent=wakes_agent)
            return
        self.nudger.send_nudge(question.session_agent_id, QUESTION_ANSWERED.nudge(question=question.id), ANSWER_SOURCE, context, wakes_agent=wakes_agent)
        if question.message_id is not None:
            self.nudger.send(question.session_agent_id, QUESTION_ANSWER_SOURCE, ANSWER_SOURCE, context, question=question.id, message=question.message_id,
                             reference=f"question:{question.id} message:{question.message_id}")

    def has_waking_wait(self, question: Question, context: Context) -> bool:
        """Whether a wait on the question is still open, or this answer ended it without the agent working again."""
        targets = self.queries.query(WaitTarget).filter(row_table="questions", row_id=question.id).select_columns("wait_id")
        waits = self.queries.query(Wait).where_in("id", targets)
        return waits.where("state", "!=", WaitState.ENDED).exists() or waits.filter(ended_at=context.timestamp).where("outcome", "!=", WORK_CONTINUED).exists()
