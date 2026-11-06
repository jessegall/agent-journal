from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.dependency_waits import DependencyWaits
from suites.coding.modules.workers.commands.record_worktree_release.record_worktree_release import RecordWorktreeRelease
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree

WAITING_STATES = (TaskState.OPEN, TaskState.BLOCKED)
ASSIGNED_STATES = (TaskState.STARTED, TaskState.TESTING)


class RecordWorktreeReleaseHandler(Handler[RecordWorktreeRelease, Worktree]):
    """Abandons a worktree and releases the tasks still assigned to its worker, those it moved past with proofs not
    all checked included."""

    command = RecordWorktreeRelease
    runs_once = True

    def __init__(self, queries: Queries, repository: Repository, rows: EventRows, waits: DependencyWaits) -> None:
        self.queries, self.repository, self.rows, self.waits = queries, repository, rows, waits

    def handle(self, command: RecordWorktreeRelease, context: Context) -> Worktree:
        worktree = self.rows.required(Worktree, command.worktree_id)
        abandoned = self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.abandon), context)
        task = self.rows.required(Task, worktree.task_id)
        changed_ids: list[int] = []
        if task.delegated_to == worktree.session_agent_id and task.state in ASSIGNED_STATES:
            self.release_task(task, command.reason, context)
            changed_ids.append(task.id)
        assigned_tasks = tuple(self.queries.query(Task).filter(delegated_to=worktree.session_agent_id).matching(Among("state", ASSIGNED_STATES)).all_rows())
        for unproved_task in [assigned_task for assigned_task in assigned_tasks if not self.has_all_proofs_checked(assigned_task, worktree)]:
            self.release_task(unproved_task, command.reason, context)
            changed_ids.append(unproved_task.id)
        for delegated in tuple(self.queries.query(Task).filter(delegated_to=worktree.session_agent_id).matching(Among("state", WAITING_STATES)).all_rows()):
            self.repository.update(delegated, context, delegated_to=None)
            changed_ids.append(delegated.id)
        self.waits.update_tasks(changed_ids, context)
        return abandoned

    def release_task(self, task: Task, reason: str, context: Context) -> None:
        self.repository.save_change(task, replace(task.release(context.timestamp, context.actor, reason), delegated_to=None), context)

    def has_all_proofs_checked(self, task: Task, worktree: Worktree) -> bool:
        proofs = tuple(self.queries.query(Proof).filter(task_id=task.id, worktree_id=worktree.id).all_rows())
        return bool(proofs) and all(proof.state is ProofState.CHECKED for proof in proofs)
