from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.tasks.conditions.task_tag_match import TaskTagMatch
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task_card import TaskCard

FINISHED_STATES = (TaskState.COMPLETED, TaskState.CANCELLED)


class TaskBoardCards:
    """The task cards of one board group: the tasks of a state, carrying every tag asked for."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def matching_states(self, *states: TaskState) -> Query[TaskCard]:
        return self.queries.query(TaskCard).matching(Among("state", [state.value for state in states]))

    def cards(self, state: TaskState | str, tags: list[str]) -> Query[TaskCard]:
        cards = self.queries.query(TaskCard)
        for word in tags:
            cards = cards.matching(TaskTagMatch(word))
        return cards.filter(state=state)
