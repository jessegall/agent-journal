from dataclasses import replace

from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.tasks.models.task_wait import TaskWait
from suites.coding.modules.checks.models.check import Check


class TaskWaitCheckListener(SaveListener):
    """A task's wait on a command runs as a check; the check is removed when the wait ends."""

    name = "checks.task-wait-check"
    event = "task_wait.*"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, change: Change[Model]) -> None:
        wait = change.row
        if not isinstance(wait, TaskWait) or not wait.command:
            return
        if wait.ended_at is None:
            self.repository.save(Check(creator_id=wait.creator_id, title=f"Task {wait.task_id} waits until this passes", command=wait.command,
                                       interval_minutes=wait.interval_minutes, task_wait_id=wait.id, hidden=True), change.context)
            return
        for check in tuple(self.queries.query(Check).filter(task_wait_id=wait.id).all_rows()):
            if check.removed_at is None:
                self.repository.save(replace(check, removed_at=change.context.timestamp), change.context)
