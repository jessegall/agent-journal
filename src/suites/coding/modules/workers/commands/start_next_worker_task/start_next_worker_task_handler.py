from engine.command.bus import Bus
from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.scopes import Scopes
from engine.listener.event_rows import EventRows
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.support.worker_test_group import WorkerTestGroup
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test_handler import RecordWorkerTestHandler
from suites.coding.modules.workers.commands.start_next_worker_task.start_next_worker_task import StartNextWorkerTask
from suites.coding.modules.workers.support.delivery_differences import DeliveryDifferences
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.models.enums.submission import Submission
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from suites.coding.modules.workers.support.worker_task_commit import WorkerTaskCommit
from suites.coding.modules.workers.support.worker_compaction import WorkerCompaction
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask


class StartNextWorkerTaskHandler(Handler[StartNextWorkerTask, Task]):
    """Commits the worker's current task, moves it to testing and queues its proofs' tests; the next task
    delegated to it starts now when there are no tests, else once they pass. A task in testing with no test
    going has them queued again, or lets the worker go on. Inside a phase of a started plan the next task
    starts at once and nothing is queued; with the next task outside the phase, the whole phase is handed in."""

    command = StartNextWorkerTask
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, worktrees: WorktreeQuery, tasks: TaskQuery, task_commit: WorkerTaskCommit, proof_queue: WorkerProofQueue, repository: Repository, bus: Bus, queries: Queries, phases: WorkerPhases, results: RecordWorkerTestHandler, differences: DeliveryDifferences, next_task: WorkerNextTask, compaction: WorkerCompaction, guidance: WorkerGuidance, scopes: Scopes) -> None:
        self.scopes = scopes
        self.next_task, self.guidance = next_task, guidance
        self.compaction = compaction
        self.rows, self.worktrees, self.tasks, self.task_commit, self.proof_queue, self.repository, self.bus = rows, worktrees, tasks, task_commit, proof_queue, repository, bus
        self.queries, self.phases, self.results, self.differences = queries, phases, results, differences

    def check_rows(self, command: StartNextWorkerTask, actor: Actor) -> None:
        worktree = self.worktrees.worker_worktree(actor.id)
        if worktree is None or worktree.state is not WorktreeState.CUT or self.guidance.point(actor.id).step is WorkerStep.BLOCKED:
            raise Refusal(self.guidance.line(actor.id))
        task = self.rows.required(Task, worktree.task_id)
        if task.state is not TaskState.STARTED:
            return
        if self.next_task.following(actor.id) is None:
            raise Refusal(f"task {task.id} is your last", "journal worker deliver hands in all your tasks")
        self.task_commit.check_proofs(worktree, task)

    def prepare(self, command: StartNextWorkerTask, actor: Actor) -> None:
        worktree = self.worktrees.worker_worktree(actor.id)
        if worktree is None or worktree.state is not WorktreeState.CUT:
            return
        task = self.queries.query(Task).find(worktree.task_id)
        with self.scopes.opened(actor.id, None, self.disabled_scopes):
            has_next_task = self.next_task.following(actor.id) is not None
        if task.state is TaskState.STARTED and has_next_task:
            self.task_commit.check_proofs(worktree, task)
            self.task_commit.commit(worktree, tuple([task]), actor, command.differences)

    def handle(self, command: StartNextWorkerTask, context: Context) -> Task:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None or worktree.state is not WorktreeState.CUT or self.guidance.point(context.actor.id).step is WorkerStep.BLOCKED:
            raise Refusal(self.guidance.line(context.actor.id))
        task = self.rows.required(Task, worktree.task_id)
        if task.state is TaskState.STARTED:
            self.differences.record(task.id, command.differences, context)
        if task.state is TaskState.TESTING:
            if self.proof_queue.tests_pending(worktree):
                raise Refusal(self.guidance.line(context.actor.id))
            submission = self.proof_queue.resubmit(worktree, task, context)
            if submission is Submission.QUEUED:
                return task
            if submission is Submission.UNTESTED:
                self.close_checked(task, context)
            task = self.rows.required(Task, worktree.task_id)
        started_task = self.tasks.holder(context.actor.id).started().first()
        if task.state is not TaskState.STARTED and started_task is not None:
            self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.advance, task_id=started_task.id), context)
            return started_task
        following = self.next_task.following(context.actor.id)
        if following is None:
            raise Refusal(f"task {task.id} is your last", "journal worker deliver hands in all your tasks")
        if task.state is not TaskState.STARTED:
            return self.start_following(worktree, following, context)
        tested = self.repository.save_change(task, task.moved(TaskLifecycle.test), context)
        group = self.phases.group(worktree, tested)
        if group is not None:
            if self.phases.continues_group(group, following):
                return self.continue_group(worktree, following, context)
            return self.submit_group(worktree, tested, group, following, context)
        submission = self.proof_queue.submit(worktree, tested, None, context)
        if submission is Submission.QUEUED:
            return tested
        if submission is Submission.UNTESTED:
            self.close_checked(tested, context)
        return self.start_following(worktree, following, context)

    def continue_group(self, worktree: Worktree, following: Task, context: Context) -> Task:
        returned_task = self.tasks.holder(context.actor.id).started().first()
        if returned_task is None:
            return self.start_following(worktree, following, context)
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.advance, task_id=returned_task.id), context)
        return returned_task

    def submit_group(self, worktree: Worktree, task: Task, group: WorkerTestGroup, following: Task, context: Context) -> Task:
        for started in tuple(self.tasks.holder(context.actor.id).started().all_rows()):
            self.repository.save_change(started, started.moved(TaskLifecycle.test), context)
        submission = self.proof_queue.submit(worktree, task, group, context)
        if submission is Submission.QUEUED:
            return task
        if submission is Submission.COMMITTED:
            return self.start_following(worktree, following, context)
        self.results.finish(worktree, context)
        return self.rows.required(Task, self.rows.required(Worktree, worktree.id).task_id)

    def start_following(self, worktree: Worktree, following: Task, context: Context) -> Task:
        started = self.bus.dispatch(StartTask(following.id), context)
        current = self.rows.required(Worktree, worktree.id)
        if current.task_id != following.id:
            self.repository.save_change(current, current.moved(WorktreeLifecycle.advance, task_id=following.id), context)
        self.compaction.stop_after_task(context.actor.id)
        return started

    def close_checked(self, task: Task, context: Context) -> None:
        proofs = tuple(self.queries.query(Proof).filter(task_id=task.id).all_rows())
        if proofs and all(proof.state is ProofState.CHECKED for proof in proofs):
            self.repository.save_change(task, task.close(context.timestamp, context.actor, "its proofs are checked"), context)
