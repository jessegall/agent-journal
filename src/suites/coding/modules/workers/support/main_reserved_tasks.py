from collections.abc import Sequence

from engine.database.kept_rows import KeptRows
from engine.errors.refusal import Refusal
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.assignee_label import AssigneeLabel


class MainReservedTasks:
    """Refuses to send a task assigned to a running main agent to a worker, unless that main agent sends it: a main
    agent gives its own tasks to a worker, and the worker's assignment replaces its own."""

    def __init__(self, tasks: TaskQuery, kept: KeptRows, labels: AssigneeLabel) -> None:
        self.tasks, self.kept, self.labels = tasks, kept, labels

    def check(self, task_ids: Sequence[int], sender_id: int) -> None:
        reserved = self.kept.scoped_current(self.tasks.main_reserved(task_ids, sender_id).first, name=f"workers.main_reserved:{tuple(task_ids)}:{sender_id}")
        if reserved is not None:
            raise Refusal(f"task {reserved.id} is assigned to {self.labels.task_label(reserved)}", f"journal task assign {reserved.id} --to <worker> moves it")
