from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from engine.driver.nudger import Nudger
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.commands.record_worktree_merge.record_worktree_merge import RecordWorktreeMerge
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.enums.merge_ask_state import MergeAskState
from suites.coding.modules.workers.models.lifecycles.merge_ask_lifecycle import MergeAskLifecycle
from suites.coding.modules.workers.models.merge_ask import MergeAsk
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.checkpoint_wait_text import CheckpointWaitText
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_MERGE_CONFLICT
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance
from suites.coding.modules.workers.support.work_units import UNIT_TASKS_REASON

CLASH_SHORTFALL = "the merge clashed on {files}: settle them and prove it again"


class RecordWorktreeMergeHandler(Handler[RecordWorktreeMerge, MergeOutcome]):
    """Closes the worker's delivered tasks that have a proof of their own in the worktree once git has merged it, and
    names the others it leaves open, or restarts its task with the
    files that clashed. The proofs of the worktree go short when it clashes, as for a failed test. A task of a started plan is closed with the checkpoint its tests run at. The worker's
    ask that waited for this merge is merged with it."""

    command = RecordWorktreeMerge
    runs_once = True
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, rows: EventRows, repository: Repository, nudger: Nudger, advance: WorkerTaskAdvance, guidance: WorkerGuidance, wait_text: CheckpointWaitText, proofs: ProofQuery) -> None:
        self.wait_text, self.proofs = wait_text, proofs
        self.queries, self.rows, self.repository, self.nudger, self.advance, self.guidance = queries, rows, repository, nudger, advance, guidance

    def handle(self, command: RecordWorktreeMerge, context: Context) -> MergeOutcome:
        worktree = self.rows.required(Worktree, command.worktree_id)
        task = self.rows.required(Task, worktree.task_id)
        if command.conflicts:
            return MergeOutcome(self.returned(worktree, task, command.conflicts, context), command.conflicts)
        testing_tasks = self.delivered_tasks(worktree, task)
        proven_ids = {proof.task_id for proof in self.proofs.worktree_rows(worktree.id)}
        delivered_tasks = [delivered for delivered in testing_tasks if delivered.id in proven_ids]
        left_open = tuple(delivered.id for delivered in testing_tasks if delivered.id not in proven_ids)
        task_ids = [delivered.id for delivered in delivered_tasks]
        reasons = dict.fromkeys(task_ids, command.reason) if command.reason else self.wait_text.merged_reasons(worktree, task_ids)
        for delivered in delivered_tasks:
            self.repository.save_change(delivered, delivered.close(context.timestamp, context.actor, reasons[delivered.id]), context)
        waiting_request = self.queries.query(MergeAsk).filter(worktree_id=worktree.id, state=MergeAskState.WAITING).first()
        if waiting_request is not None:
            self.repository.save_change(waiting_request, waiting_request.moved(MergeAskLifecycle.merge), context)
        merged = replace(worktree.merge(context.timestamp, context.actor), commit_before_merge=command.commit_before_merge, commit_after_merge=command.commit_after_merge,
                         merged_task_ids=worktree.with_merged([delivered.id for delivered in delivered_tasks]))
        return MergeOutcome(self.repository.save_change(worktree, merged, context), (), left_open=left_open)

    def delivered_tasks(self, worktree: Worktree, task: Task) -> list[Task]:
        delivered = tuple(self.queries.query(Task).matching(TaskQuery.assignee(worktree.session_agent_id)).filter(state=TaskState.TESTING).every_row(UNIT_TASKS_REASON))
        return [row for row in (task, *delivered) if row.state is TaskState.TESTING and (row is task or row.id != task.id)]

    def returned(self, worktree: Worktree, task: Task, conflicts: tuple[str, ...], context: Context) -> Worktree:
        files = ", ".join(conflicts)
        for proof in self.proofs.worktree_rows(worktree.id):
            if proof.state is not ProofState.SHORT:
                self.repository.save_change(proof, proof.moved(ProofLifecycle.short, shortfall=CLASH_SHORTFALL.format(files=files)), context)
        self.advance.restart_task(worktree, task, context)
        self.nudger.send(worktree.session_agent_id, WORKER_MERGE_CONFLICT, MERGE_CONFLICT_SOURCE, context, branch=worktree.base_branch, lines=files, line=self.guidance.conflict_line(task, files))
        return self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.rework), context)
