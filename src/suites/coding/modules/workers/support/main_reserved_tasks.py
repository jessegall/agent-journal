from collections.abc import Sequence

from engine.database.kept_rows import KeptRows
from engine.errors.refusal import Refusal
from core.modules.tasks.queries.task_query import TaskQuery


class MainReservedTasks:
    """Refuses to send a task reserved for a running main agent to a worker; task assign moves it instead."""

    def __init__(self, tasks: TaskQuery, kept: KeptRows) -> None:
        self.tasks, self.kept = tasks, kept

    def check(self, task_ids: Sequence[int]) -> None:
        reserved = self.kept.scoped_current(self.tasks.main_reserved(task_ids).first, name=f"workers.main_reserved:{tuple(task_ids)}")
        if reserved is not None:
            raise Refusal(f"task {reserved.id} is reserved for agent {reserved.delegated_to}", f"journal task assign {reserved.id} --to <worker> moves it")
