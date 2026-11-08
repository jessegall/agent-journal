from core.base.query.conditions.among import Among
from core.base.query.conditions.has_value import HasValue
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.query.query import Query
from core.modules.tasks.conditions.task_tag_match import TaskTagMatch
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task_card import TaskCard

ACTIVE_STATES = (TaskState.STARTED, TaskState.TESTING, TaskState.BLOCKED, TaskState.OPEN)
FINISHED_STATES = (TaskState.COMPLETED, TaskState.CANCELLED)
DELEGATED = "delegated"


class TaskBoardCards:
    """The task cards of one board group: the tasks of a state that are not delegated, the delegated tasks that are not finished,
    or the finished tasks of a state."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def every(self, state: TaskState) -> Query[TaskCard]:
        return self.queries.query(TaskCard).filter(state=state)

    def cards(self, state: TaskState | str, tags: list[str]) -> Query[TaskCard]:
        cards = self.queries.query(TaskCard)
        for word in tags:
            cards = cards.matching(TaskTagMatch(word))
        if state == DELEGATED:
            return cards.matching(HasValue("delegated_to")).matching(Among("state", [active.value for active in ACTIVE_STATES]))
        cards = cards.filter(state=state)
        return cards if state in FINISHED_STATES else cards.matching(IsNull("delegated_to"))
