from core.base.query.queries import Queries
from core.modules.tasks.rules.support.current_task import CurrentTask
from core.modules.tasks.models.task_log import TaskLog
from core.modules.tasks.queries.task_query import TaskQuery


class CurrentTasks:
    """Finds the started task an agent holds, for the tasks module's rules."""

    def __init__(self, tasks: TaskQuery, queries: Queries) -> None:
        self.tasks, self.queries = tasks, queries

    def current(self, agent_id: int) -> CurrentTask | None:
        current = self.tasks.holder(agent_id).started().newest().page(1, 1).rows
        if not current:
            return None
        logs = self.queries.query(TaskLog).filter(task_id=current[0].id).newest().page(1, 1).rows
        return CurrentTask(current[0], logs[0] if logs else None)
