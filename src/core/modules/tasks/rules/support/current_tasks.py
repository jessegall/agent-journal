from core.base.query.queries import Queries
from core.modules.tasks.rules.support.current_task import CurrentTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog
from core.modules.tasks.queries.task_query import TaskQuery


class CurrentTasks:
    """Finds the started tasks an agent holds, newest started first, for the tasks module's rules; the newest
    is its current task."""

    def __init__(self, tasks: TaskQuery, queries: Queries) -> None:
        self.tasks, self.queries = tasks, queries

    def started_tasks(self, agent_id: int) -> list[Task]:
        return list(self.tasks.holder(agent_id).started().descending("started_at").all_rows())

    def current(self, agent_id: int) -> CurrentTask | None:
        current = self.tasks.holder(agent_id).started().descending("started_at").limited(1)
        if not current:
            return None
        logs = self.queries.query(TaskLog).filter(task_id=current[0].id).newest().limited(1)
        return CurrentTask(current[0], logs[0] if logs else None)
