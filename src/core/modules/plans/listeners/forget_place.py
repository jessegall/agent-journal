from core.base.change.change import Change
from core.base.listener.deletion_listener import DeletionListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.plans.phase_task import PhaseTask


class ForgetPlace(DeletionListener):
    """Removes a task's place in a phase before the task is deleted, so the deletion is logged and not refused."""

    name = "plans.forget-place"
    event = "task.delete"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, change: Change[Model]) -> None:
        for place in self.queries.query(PhaseTask).filter(task_id=change.row.id).page(1, 1).rows:
            self.repository.delete(place, change.context)
