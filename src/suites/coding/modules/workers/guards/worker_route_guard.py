from pathlib import Path

from core.base.actor_type import ActorType
from core.base.change.moved import Moved
from core.base.change.updated import Updated
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.listener.event_rows import EventRows
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.record_worktree_cut.record_worktree_cut import RecordWorktreeCut
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.support.worker_route_policy import ROUTE_GUARD
from suites.coding.modules.workers.support.worker_routes import WorkerRoutes


class WorkerRouteGuard(Guard[Updated[Task] | Moved[Task]]):
    """Holds direct assignments to their ready program, with a person's exception."""

    name = ROUTE_GUARD
    moves = tuple([TaskLifecycle.release])

    def __init__(self, routes: WorkerRoutes, rows: EventRows, states: ProgramStates, environments: EnvironmentRows) -> None:
        self.routes, self.rows, self.states, self.environments = routes, rows, states, environments

    def check(self, event: Updated[Task] | Moved[Task], context: Context) -> None:
        task = event.row
        if context.actor.type is ActorType.USER or task.delegated_to is None or task.delegated_to == event.old_row.delegated_to:
            return
        if isinstance(context.command, (RecordWorktreeCut, SendWorker)):
            return
        route = self.routes.first_match(task)
        if route is None or not route.program:
            return
        worker = self.rows.required(Agent, task.delegated_to)
        if worker.program == route.program:
            return
        folder = Path(self.environments.find(task.environment_id).folder)
        if self.states.state(route.program, folder).is_ready:
            raise Refusal(f"task {task.id} goes to {route.program} by route {route.id}", "journal worker-route list shows the routes")
