from core.modules.tasks.queries.task_query import TASK_PAGE_ROWS, TaskQuery
from core.modules.assignments.support.assignments import Assignments

from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.dependency_waits import DependencyWaits
from suites.coding.modules.workers.commands.record_worktree_release.record_worktree_release import RecordWorktreeRelease
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree

WAITING_STATES = (TaskState.OPEN, TaskState.BLOCKED)
ASSIGNED_STATES = (TaskState.STARTED, TaskState.TESTING)


class RecordWorktreeReleaseHandler(Handler[RecordWorktreeRelease, Worktree]):
    """Abandons a worktree, or keeps a merged one as it is, and releases the tasks still assigned to its worker,
    those it moved past with proofs not all checked included."""

    command = RecordWorktreeRelease
    runs_once = True

    def __init__(self, queries: Queries, repository: Repository, rows: EventRows, waits: DependencyWaits, assignments: Assignments) -> None:
        self.queries, self.repository, self.rows, self.waits, self.assignments = queries, repository, rows, waits, assignments

    def handle(self, command: RecordWorktreeRelease, context: Context) -> Worktree:
        worktree = self.rows.required(Worktree, command.worktree_id)
        abandoned = worktree if worktree.state is WorktreeState.MERGED else self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.abandon), context)
        task = self.rows.required(Task, worktree.task_id)
        changed_ids: list[int] = []
        if task.state in ASSIGNED_STATES and self.assignments.actor(task) == worktree.session_agent_id:
            self.release_task(task, command.reason, context)
            changed_ids.append(task.id)
        worker_tasks = self.queries.query(Task).matching(TaskQuery.assignee(worktree.session_agent_id)).oldest()
        assigned_tasks = tuple(worker_tasks.matching(Among("state", ASSIGNED_STATES)).all_rows(TASK_PAGE_ROWS))
        for unproved_task in [assigned_task for assigned_task in assigned_tasks if not self.has_all_proofs_checked(assigned_task, worktree)]:
            self.release_task(unproved_task, command.reason, context)
            changed_ids.append(unproved_task.id)
        waiting = tuple(worker_tasks.matching(Among("state", WAITING_STATES)).all_rows(TASK_PAGE_ROWS))
        self.assignments.unassign_rows(waiting, context)
        changed_ids.extend(waiting_task.id for waiting_task in waiting)
        self.waits.update_tasks(changed_ids, context)
        return abandoned

    def release_task(self, task: Task, reason: str, context: Context) -> None:
        self.repository.save_change(task, task.release(context.timestamp, context.actor, reason), context)
        self.assignments.unassign(task, context)

    def has_all_proofs_checked(self, task: Task, worktree: Worktree) -> bool:
        proofs = tuple(self.queries.query(Proof).filter(task_id=task.id, worktree_id=worktree.id).all_rows())
        return bool(proofs) and all(proof.state is ProofState.CHECKED for proof in proofs)
