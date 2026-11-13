from core.modules.assignments.support.assignments import Assignments
from core.modules.plans.commands.assign_plan.assign_plan import AssignPlan
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from engine.repository.repository import Repository
from suites.coding.modules.workers.commands.record_worktree_takeover.record_worktree_takeover import RecordWorktreeTakeover
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.work_units import WorkUnits
from suites.coding.modules.workers.support.work_units import UNIT_TASKS_REASON



class RecordWorktreeTakeoverHandler(Handler[RecordWorktreeTakeover, Worktree]):
    """Moves the worktree, every task the stopped worker still holds and its plan to the new worker."""

    command = RecordWorktreeTakeover

    def __init__(self, rows: EventRows, queries: Queries, repository: Repository, bus: Bus, assignments: Assignments, units: WorkUnits) -> None:
        self.rows, self.queries, self.repository, self.bus = rows, queries, repository, bus
        self.assignments, self.units = assignments, units

    def handle(self, command: RecordWorktreeTakeover, context: Context) -> Worktree:
        worktree = self.rows.required(Worktree, command.worktree_id)
        plan = self.units.unit(worktree.session_agent_id).plan
        blocked = tuple(self.queries.query(Task).matching(TaskQuery.assignee(worktree.session_agent_id)).filter(closed_at=None).every_row(UNIT_TASKS_REASON))
        claimed = self.repository.save_change(worktree, worktree.taken_over(command.worker_id), context)
        for task in blocked:
            if task.holder_id == worktree.session_agent_id:
                self.repository.update(task, context, holder_id=command.worker_id)
            self.assignments.assign_kept(task, command.worker_id, context, cascade=False)
        if plan is not None:
            self.bus.run_with_context(AssignPlan(plan.id, command.worker_id), context)
        return claimed
