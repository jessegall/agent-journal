from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question


class QuestionQuery(Query[Question]):
    """Reads questions, with the filters the questions module uses by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Question)

    def environment(self, environment_id: int) -> Self:
        return self.filter(environment_id=environment_id)

    def open_ones(self) -> Self:
        return self.filter(state=QuestionState.OPEN)

    def agent(self, agent_id: int) -> Self:
        return self.filter(agent_id=agent_id)

    def state(self, state: QuestionState) -> Self:
        return self.filter(state=state)
