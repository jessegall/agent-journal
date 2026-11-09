from core.base.listener.deletion_listener import DeletionListener
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.plans.models.phase_task import PhaseTask
from core.modules.plans.support.positions import Positions
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.modules.tasks.models.task import Task


class ForgetPlaceListener(DeletionListener[Deleted[Task]]):
    """Removes a task's place in a phase before the task is deleted, so the deletion is logged and not
    refused, and closes the gap it leaves."""

    name = "plans.forget-place"

    def __init__(self, queries: Queries, repository: Repository, positions: Positions) -> None:
        self.queries, self.repository, self.positions = queries, repository, positions

    def handle(self, event: Deleted[Task], context: Context) -> None:
        place = self.queries.query(PhaseTask).filter(task_id=event.row.id).first()
        if place is not None:
            self.repository.delete(place, context)
            self.positions.renumber(PhaseTask, "phase_id", place.phase_id, place.position, context)
