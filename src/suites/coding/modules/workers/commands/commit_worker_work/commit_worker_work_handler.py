from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.tasks.models.task import Task
from dataclasses import replace

from core.modules.agents.support.agent_label import AgentLabel
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog
from core.modules.tasks.models.enums.task_state import TaskState
from engine.cli.row_numbers import RowNumbers
from engine.command.bus import Bus
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from suites.coding.modules.workers.commands.commit_worker_work.commit_worker_work import CommitWorkerWork
from suites.coding.modules.workers.support.checkpoint_wait_text import CheckpointWaitText
from suites.coding.modules.workers.support.commit_outcome import CommitOutcome
from suites.coding.modules.workers.support.commit_subject import CommitSubject
from suites.coding.modules.workers.support.staging import Staging
from suites.coding.modules.workers.support.worker_staging import WorkerStaging
from suites.coding.modules.workers.support.delivery_differences import DeliveryDifferences
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test_handler import RecordWorkerTestHandler
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.models.enums.submission import Submission
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from suites.coding.modules.workers.support.worker_task_commit import WorkerTaskCommit
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.support.worker_free_task import WorkerFreeTask
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance


INTERIM_TEXT = "Interim: go on with {tasks}"
BACKGROUND_TESTS_TEXT = "tests run in the background"
FINAL_TEXT = "Final: your work is handed in, stop and wait"
FINAL_MERGE_TEXT = "Final: your work is handed in, stop and wait for the merge"
PROOF_HINT = 'journal proof make <point> --task <task> "<file:line, and the test>"'


class CommitWorkerWorkHandler(Handler[CommitWorkerWork, CommitOutcome]):
    """Commits the started tasks of a worker whose every point is proved: one git commit for them, each moved
    to testing and its proofs submitted. Outside a started plan their tests are queued, and with nothing to
    run it finishes at once; in a started plan they wait for the checkpoint. A started task with no shown
    proof stays started and is named in the answer: the commit is then interim and the worktree stays cut
    on that task. A commit that leaves no started task is final and delivers the worktree. A worker with no
    started task commits for the task of its worktree, which delivers the worktree. The worker is given the
    next free task it may take, which it starts when this work is done."""

    command = CommitWorkerWork
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, worktrees: WorktreeQuery, proof_queue: WorkerProofQueue, repository: Repository, task_commit: WorkerTaskCommit, results: RecordWorkerTestHandler,
                 differences: DeliveryDifferences, free_task: WorkerFreeTask, guidance: WorkerGuidance, staging: WorkerStaging, wait_text: CheckpointWaitText, bus: Bus, numbers: RowNumbers) -> None:
        self.wait_text, self.bus, self.numbers = wait_text, bus, numbers
        self.rows, self.worktrees, self.proof_queue, self.repository, self.task_commit = rows, worktrees, proof_queue, repository, task_commit
        self.results, self.differences, self.free_task, self.guidance, self.staging = results, differences, free_task, guidance, staging

    def check_rows(self, command: CommitWorkerWork, actor: Actor) -> None:
        self.checked_staging(actor)

    def checked_staging(self, actor: Actor) -> Staging:
        worktree = self.worktrees.worker_worktree(actor.id)
        point = self.guidance.point(actor.id)
        if worktree is None or worktree.state is not WorktreeState.CUT or point.step is WorkerStep.BLOCKED:
            raise Refusal(point.line)
        staging = point.round.required_staging()
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
        tasks = tuple(task for task in self.commit_tasks(committed, staging) if task.id in committed.commit_tasks())
        open_tasks = staging.started_except(committed.commit_tasks())
        worker_label = AgentLabel.from_row_id(context.actor.id, self.numbers, "worker").text
        for task in tasks:
            self.differences.record(task.id, command.differences, context)
            self.bus.dispatch(MakeTaskLog(task.id, f"committed in {committed.commit_short_id} by {worker_label}"), replace(context, actor=Actor.core()))
        self.free_task.give_next(context.actor.id, context)
        for task in tasks:
            if task.state is TaskState.STARTED:
                self.repository.save_change(task, task.moved(TaskLifecycle.test), context)
        worktree = self.repository.save_change(committed, self.moved_worktree(committed, open_tasks, tasks, context), context)
        submission = self.proof_queue.submit_ready(worktree, tasks, context)
        if submission is Submission.UNTESTED:
            self.results.finish(worktree, context)
        return CommitOutcome(tasks, worktree, submission, self.next_step_text(tasks, open_tasks, submission), staging.notes())

    def moved_worktree(self, worktree: Worktree, open_tasks: tuple[Task, ...], tasks: tuple[Task, ...], context: Context) -> Worktree:
        if not open_tasks:
            return worktree.moved(WorktreeLifecycle.deliver, delivered_at=context.timestamp, logs_read_at=None, logs_output_id=None, tests_passed_at=None, returned_at=None,
                                  merge_ready_at=self.proof_queue.merge_ready_time(tasks[0], context), commit_count=worktree.commit_count + 1)
        return worktree.moved(WorktreeLifecycle.advance, task_id=open_tasks[0].id, commit_count=worktree.commit_count + 1)

    def next_step_text(self, tasks: tuple[Task, ...], open_tasks: tuple[Task, ...], submission: Submission) -> str:
        if not open_tasks:
            return FINAL_MERGE_TEXT if submission is Submission.COMMITTED else FINAL_TEXT
        interim_text = INTERIM_TEXT.format(tasks=CommitSubject(open_tasks).label())
        if submission is Submission.QUEUED:
            return f"{interim_text}; {BACKGROUND_TESTS_TEXT}"
        checkpoint_text = self.wait_text.tests_text(tasks[0].id) if submission is Submission.COMMITTED else None
        return interim_text if checkpoint_text is None else f"{interim_text}; {checkpoint_text}"
