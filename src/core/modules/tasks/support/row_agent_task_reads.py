from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.agents.support.agent_task_reads import AgentTaskReads
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery

UNFINISHED_STATES = (TaskState.OPEN, TaskState.STARTED, TaskState.BLOCKED, TaskState.TESTING)
TASK_LIMIT_ROWS = 6


class RowAgentTaskReads(AgentTaskReads):
    """Reads the unfinished tasks assigned to an agent and the ones it started itself, lowest number first,
    the first six of each."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def open_task_ids(self, agent_id: int) -> tuple[int, ...]:
        unfinished = Among("state", tuple(state.value for state in UNFINISHED_STATES))
        assigned = self.queries.query(Task).matching(TaskQuery.assignee(agent_id)).matching(unfinished).oldest().page(1, TASK_LIMIT_ROWS).rows
        started = self.queries.query(Task).filter(holder_id=agent_id).matching(unfinished).oldest().page(1, TASK_LIMIT_ROWS).rows
        return tuple(sorted({task.id for task in (*assigned, *started)}))
