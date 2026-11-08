from collections.abc import Sequence

from core.base.refusal import Refusal
from core.modules.tasks.queries.task_query import TaskQuery


class MainReservedTasks:
    """Keeps a task reserved for a running main agent from being sent to a worker: moving it is an assignment of its own."""

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def check(self, task_ids: Sequence[int]) -> None:
        reserved = self.tasks.reserved_for_main(task_ids).first()
        if reserved is not None:
            raise Refusal(f"task {reserved.id} is reserved for agent {reserved.delegated_to}", f"journal task assign {reserved.id} --to <worker> moves it")
