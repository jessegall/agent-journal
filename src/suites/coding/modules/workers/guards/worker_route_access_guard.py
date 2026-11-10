from engine.change.changed import Changed
from engine.command.context import Context
from engine.guard.guard import Guard
from core.modules.helpers.support.program_change_access import ProgramChangeAccess
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class WorkerRouteAccessGuard(Guard[Changed[WorkerRoute]]):
    """Refuses child agents on every route write."""

    name = "workers.route-access"
    is_safety = True

    def __init__(self, access: ProgramChangeAccess) -> None:
        self.access = access

    def check(self, event: Changed[WorkerRoute], context: Context) -> None:
        self.access.check(context.actor)
