from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.event.created import Created
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.assignments.models.assignment import Assignment
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.record_worktree_cut.record_worktree_cut import RecordWorktreeCut
from suites.coding.modules.workers.support.worker_route_policy import ROUTE_GUARD, WorkerRoutePolicy
from suites.coding.modules.workers.support.worker_route_request import WorkerRouteRequest


class WorkerRouteGuard(Guard[Created[Assignment]]):
    """Holds a task given to a worker to its ready program, with a user's exception. A task its own holder
    is given, one given as a worktree is cut, and one given to a user pass."""

    name = ROUTE_GUARD

    def __init__(self, policy: WorkerRoutePolicy, rows: EventRows) -> None:
        self.policy, self.rows = policy, rows

    def check(self, event: Created[Assignment], context: Context) -> None:
        assignment = event.row
        if assignment.subject_model != Task.model_name or context.actor.type is ActorType.USER or isinstance(context.command, RecordWorktreeCut):
            return
        task = self.rows.required(Task, assignment.subject_id)
        if assignment.actor_id == task.holder_id:
            return
        worker = self.rows.find(Agent, assignment.actor_id)
        if worker is None or worker.role == AgentRole.MAIN:
            return
        self.policy.check_task(task, WorkerRouteRequest(worker.program, context.actor.type, context.skipped_guards))
