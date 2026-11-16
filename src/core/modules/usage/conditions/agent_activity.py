from engine.database.statement import Statement
from engine.agent.work.agent_work import AgentWork
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.database.kept_rows import KeptRows
from collections.abc import Mapping
from core.modules.usage.conditions.agent_activity_condition import AgentActivityCondition
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.enums.wait_type import WORK_ENDED_TYPES
from core.modules.waits.models.wait import Wait
from core.modules.questions.models.question import Question
from core.modules.questions.models.enums.question_state import QuestionState

WAITING_REASON = "the agents list keeps every agent waiting on an answer or on help among the working ones"
QUESTIONS_REASON = "the agents list keeps every agent waiting on the answer to its question among the working ones"


class AgentActivity:
    """An agent whose process runs, whose work still holds its place, or who waits on an answer to its
    question, on an ask or on help."""

    def __init__(self, work: AgentWork, queries: Queries, kept: KeptRows) -> None:
        self.work, self.queries, self.kept = work, queries, kept

    def statement(self) -> Statement:
        return self.current().statement()

    def idle(self) -> Statement:
        return self.current().idle()

    def current(self) -> AgentActivityCondition:
        return AgentActivityCondition({**self.kept.scoped_current(self.waiting, name="usage.waiting_agents"), **self.work.pending()})

    # every agent that waits on the answer to its question, on an ask or on help, read once while nothing changes
    def waiting(self) -> Mapping[int, str]:
        waits = self.queries.query(Wait).filter(state=WaitState.OPEN).matching(Among("type", WORK_ENDED_TYPES)).every_row(WAITING_REASON)
        asking = self.queries.query(Question).filter(state=QuestionState.OPEN).every_row(QUESTIONS_REASON)
        return {**{question.session_agent_id: "question" for question in asking}, **{wait.session_agent_id: wait.type.value for wait in waits}}
