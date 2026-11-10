from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.event.moved import Moved
from engine.event.updated import Updated
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.record_worktree_cut.record_worktree_cut import RecordWorktreeCut
from suites.coding.modules.workers.support.worker_route_policy import ROUTE_GUARD, WorkerRoutePolicy
from suites.coding.modules.workers.support.worker_route_request import WorkerRouteRequest


class WorkerRouteGuard(Guard[Updated[Task] | Moved[Task]]):
    """Holds direct assignments to a worker to their ready program, with a person's exception."""

    name = ROUTE_GUARD
    moves = tuple([TaskLifecycle.release])

    def __init__(self, policy: WorkerRoutePolicy, rows: EventRows) -> None:
        self.policy, self.rows = policy, rows

    def check(self, event: Updated[Task] | Moved[Task], context: Context) -> None:
        task = event.row
        if context.actor.type is ActorType.USER or task.delegated_to is None or task.delegated_to == event.previous.delegated_to or task.delegated_to == task.holder_id:
            return
        if isinstance(context.command, RecordWorktreeCut):
            return
        worker = self.rows.required(Agent, task.delegated_to)
        if worker.role == AgentRole.MAIN:
            return
        self.policy.check_task(task, WorkerRouteRequest(worker.program, context.actor.type, context.skipped_guards))
