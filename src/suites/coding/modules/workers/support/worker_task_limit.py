from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import MOST_OPEN_TASKS


class WorkerTaskLimit:
    """Counts the tasks a worker has started against the most it may have started at once."""

    def __init__(self, tasks: TaskQuery, settings: SettingValues) -> None:
        self.tasks, self.settings = tasks, settings

    def maximum(self) -> int:
        return int(self.settings.number(MOST_OPEN_TASKS))

    def started_count(self, worker_id: int, excluded: Task) -> int:
        return sum(1 for started in self.tasks.started_tasks(worker_id) if started.id != excluded.id)
