from core.base.query.queries import Queries
from core.base.database.kept_rows import KeptRows
from core.modules.tasks.rules.support.current_task import CurrentTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog
from core.modules.tasks.models.task_read import TaskRead
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.queries.task_query import TaskQuery


class CurrentTasks:
    """Finds the started tasks an agent holds, newest started first, for the tasks module's rules; the newest
    is its current task."""

    def __init__(self, tasks: TaskQuery, queries: Queries, kept: KeptRows) -> None:
        self.tasks, self.queries, self.kept = tasks, queries, kept

    def started_tasks(self, agent_id: int) -> list[Task]:
        return list(self.kept.read("tasks", lambda: tuple(self.tasks.holder(agent_id).started().descending("started_at").all_rows()),
                                   "holder_id = ? AND state = ?", [agent_id, TaskState.STARTED.value], name="tasks.current_tasks"))

    def current(self, agent_id: int) -> CurrentTask | None:
        current = self.started_tasks(agent_id)
        if not current:
            return None
        log = self.kept.read("task_logs", self.queries.query(TaskLog).filter(task_id=current[0].id).newest().first,
                             "task_id = ?", [current[0].id], name="tasks.current_log")
        return CurrentTask(current[0], log)

    def has_brief_read(self, task_id: int, agent_id: int) -> bool:
        return self.kept.read("task_reads", self.queries.query(TaskRead).filter(task_id=task_id, agent_id=agent_id).exists,
                              "task_id = ? AND agent_id = ?", [task_id, agent_id], name="tasks.brief_read")
