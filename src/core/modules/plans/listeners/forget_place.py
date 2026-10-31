from core.base.change.change import Change
from core.base.listener.deletion_listener import DeletionListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.plans.phase_task import PhaseTask
from core.modules.plans.positions import Positions


class ForgetPlace(DeletionListener):
    """Removes a task's place in a phase before the task is deleted, so the deletion is logged and not refused, and
    closes the gap it leaves."""

    name = "plans.forget-place"
    event = "task.delete"

    def __init__(self, queries: Queries, repository: Repository, positions: Positions) -> None:
        self.queries, self.repository, self.positions = queries, repository, positions

    def handle(self, change: Change[Model]) -> None:
        for place in self.queries.query(PhaseTask).filter(task_id=change.row.id).page(1, 1).rows:
            self.repository.delete(place, change.context)
            self.positions.renumber_places(place.phase_id, place.position, change.context)
