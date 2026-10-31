from core.base.query.queries import Queries
from core.modules.tasks.task_in_hand import TaskInHand
from core.modules.tasks.task_log import TaskLog
from core.modules.tasks.task_query import TaskQuery


class TasksInHand:
    """Finds the started task an agent holds, for the tasks module's rules."""

    def __init__(self, tasks: TaskQuery, queries: Queries) -> None:
        self.tasks, self.queries = tasks, queries

    def of(self, agent_id: int) -> TaskInHand | None:
        held = self.tasks.held_by(agent_id).started().newest().page(1, 1).rows
        if not held:
            return None
        logs = self.queries.query(TaskLog).filter(task_id=held[0].id).newest().page(1, 1).rows
        return TaskInHand(held[0], logs[0] if logs else None)
