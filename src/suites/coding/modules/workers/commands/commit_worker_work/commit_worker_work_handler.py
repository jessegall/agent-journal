from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from suites.coding.modules.workers.commands.commit_worker_work.commit_worker_work import CommitWorkerWork
from suites.coding.modules.workers.support.commit_outcome import CommitOutcome
from suites.coding.modules.workers.support.staging import Staging
from suites.coding.modules.workers.support.worker_staging import WorkerStaging
from suites.coding.modules.workers.support.delivery_differences import DeliveryDifferences
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test_handler import RecordWorkerTestHandler
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.models.enums.submission import Submission
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from suites.coding.modules.workers.support.worker_task_commit import WorkerTaskCommit
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.support.worker_free_task import WorkerFreeTask
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance


PROOF_HINT = 'journal proof make <point> --task <task> "<file:line, and the test>"'


class CommitWorkerWorkHandler(Handler[CommitWorkerWork, CommitOutcome]):
    """Commits the started tasks of a worker whose every point is proved: one git commit for them, each moved
    to testing, the worktree delivered and its proofs submitted: outside a started plan their tests are
    queued, and with nothing to run it finishes at once; in a started plan they wait for the checkpoint. A
    started task with no shown proof stays started and is named in the answer. A worker with no started task
    commits for the task of its worktree, which delivers the worktree. The worker is given the next free
    task it may take, which it starts when this work is done."""

    command = CommitWorkerWork
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, worktrees: WorktreeQuery, proof_queue: WorkerProofQueue, repository: Repository, task_commit: WorkerTaskCommit, phases: WorkerPhases, results: RecordWorkerTestHandler,
                 differences: DeliveryDifferences, free_task: WorkerFreeTask, guidance: WorkerGuidance, staging: WorkerStaging) -> None:
        self.rows, self.worktrees, self.proof_queue, self.repository, self.task_commit = rows, worktrees, proof_queue, repository, task_commit
        self.phases, self.results, self.differences, self.free_task, self.guidance, self.staging = phases, results, differences, free_task, guidance, staging

    def check_rows(self, command: CommitWorkerWork, actor: Actor) -> None:
        self.checked_staging(actor)

    def checked_staging(self, actor: Actor) -> Staging:
        worktree = self.worktrees.worker_worktree(actor.id)
        if worktree is None or worktree.state is not WorktreeState.CUT or self.guidance.point(actor.id).step is WorkerStep.BLOCKED:
            raise Refusal(self.guidance.line(actor.id))
        staging = self.staging.read(worktree)
        if not staging.entries:
            return staging
        if staging.incomplete:
            raise Refusal(staging.missing_text(), AskTopic.GENERAL.hint(staging.incomplete[0].proof_line()))
        for proof in staging.refused_short()[:1]:
            raise Refusal(f"proof {proof.id} is short: fix it and hand it in again", AskTopic.GENERAL.hint(f"journal proof make {proof.point} --task {proof.task_id} \"<file:line, and the test that shows it>\""))
        if not staging.ready:
            raise Refusal("nothing is staged", AskTopic.GENERAL.hint(PROOF_HINT))
        return staging

    def prepare(self, command: CommitWorkerWork, actor: Actor) -> None:
        staging = self.checked_staging(actor)
        worktree = self.worktrees.required_worker_worktree(actor.id)
        self.task_commit.commit(worktree, self.commit_tasks(worktree, staging), actor, command.differences)

    def commit_tasks(self, worktree: Worktree, staging: Staging) -> tuple[Task, ...]:
        if staging.entries:
            return staging.ready
        return tuple([self.rows.required(Task, worktree.task_id)])

    def handle(self, command: CommitWorkerWork, context: Context) -> CommitOutcome:
        committed = self.worktrees.required_worker_worktree(context.actor.id)
        staging = self.staging.read(committed)
        for ready in staging.ready:
            self.differences.record(ready.id, command.differences, context)
        self.free_task.give_next(context.actor.id, context)
        for ready in staging.ready:
            self.repository.save_change(ready, ready.moved(TaskLifecycle.test), context)
        task = self.rows.required(Task, committed.task_id)
        delivered = self.repository.save_change(committed, committed.moved(WorktreeLifecycle.deliver, delivered_at=context.timestamp, logs_read_at=None, logs_output_id=None, tests_passed_at=None, returned_at=None,
                                                                             merge_ready_at=self.proof_queue.merge_ready_time(task, context)), context)
        submission = self.proof_queue.submit(delivered, task, self.phases.group(delivered, task), context)
        if submission is Submission.UNTESTED:
            self.results.finish(delivered, context)
        return CommitOutcome(self.commit_tasks(delivered, staging), delivered, submission, staging.notes())
