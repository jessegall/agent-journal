from collections.abc import Sequence
from pathlib import Path

from core.base.actor_type import ActorType
from core.base.guard.guard_refusal import GuardRefusal
from core.base.guard.guard_switches import GuardSwitches
from core.base.refusal import Refusal
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worker_route import WorkerRoute
from suites.coding.modules.workers.support.worker_route_request import WorkerRouteRequest
from suites.coding.modules.workers.support.worker_routes import WorkerRoutes

ROUTE_GUARD = "workers.route-holds"


class WorkerRoutePolicy:
    """Checks requested programs against ready task routes and the caller's guard skips."""

    def __init__(self, routes: WorkerRoutes, states: ProgramStates, environments: EnvironmentRows,
                 switches: GuardSwitches) -> None:
        self.routes, self.states, self.environments, self.switches = routes, states, environments, switches

    def check_tasks(self, tasks: Sequence[Task], request: WorkerRouteRequest) -> None:
        self.check(tasks[0], self.routes.common_route(tasks), request)

    def check_task(self, task: Task, request: WorkerRouteRequest) -> None:
        self.check(task, self.routes.first_match(task), request)

    def check(self, task: Task, route: WorkerRoute | None, request: WorkerRouteRequest) -> None:
        if request.actor_type is ActorType.USER or ROUTE_GUARD in request.skipped_guards:
            return
        if route is None or not route.program or route.program == request.program:
            return
        if not self.switches.enabled(ROUTE_GUARD):
            return
        environment = self.environments.find(task.environment_id)
        if not self.states.state(route.program, Path(environment.folder)).is_ready:
            return
        model = f"; model {request.model} belongs to {request.program}" if request.model is not None else ""
        refusal = Refusal(f"task {task.id} goes to {route.program} by route {route.id}{model}",
                          "journal worker-route list shows the routes; use --tier for a model of that program")
        raise GuardRefusal(ROUTE_GUARD, refusal, f"--skip-guard {ROUTE_GUARD} --skip-reason '<why>'")
