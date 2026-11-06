from core.base.command.bus import Bus
from core.base.actor import Actor
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.plans.models.phase import Phase
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
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from suites.coding.modules.workers.support.worker_task_commit import WorkerTaskCommit


class StartNextWorkerTaskHandler(Handler[StartNextWorkerTask, Task]):
    """Commits the worker's current task, moves it to testing and queues its proofs' tests; the next task
    delegated to it starts now when there are no tests, else once they pass. A task in testing with no test
    going has them queued again, or lets the worker go on. Inside a phase of a started plan the next task
    starts at once and nothing is queued; with the next task outside the phase, the whole phase is handed in."""

    command = StartNextWorkerTask
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, worktrees: WorktreeQuery, tasks: TaskQuery, task_commit: WorkerTaskCommit, proof_queue: WorkerProofQueue, repository: Repository, bus: Bus, queries: Queries, phases: WorkerPhases, results: RecordWorkerTestHandler, differences: DeliveryDifferences) -> None:
        self.rows, self.worktrees, self.tasks, self.task_commit, self.proof_queue, self.repository, self.bus = rows, worktrees, tasks, task_commit, proof_queue, repository, bus
        self.queries, self.phases, self.results, self.differences = queries, phases, results, differences

    def prepare(self, command: StartNextWorkerTask, actor: Actor) -> None:
        worktree = self.worktrees.worker_worktree(actor.id)
        if worktree is None or worktree.state is not WorktreeState.CUT:
            return
        task = self.queries.query(Task).find(worktree.task_id)
        if task.state is TaskState.STARTED and self.tasks.next_delegated(actor.id) is not None:
            self.task_commit.commit(worktree, task, actor)

    def handle(self, command: StartNextWorkerTask, context: Context) -> Task:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None or worktree.state is not WorktreeState.CUT:
            raise Refusal("only a worker with a started task moves to its next", "journal worker-worktree list shows the worktrees")
        task = self.rows.required(Task, worktree.task_id)
        if task.state is TaskState.STARTED:
            self.differences.record(task.id, command.differences, context)
        if task.state is TaskState.TESTING:
            if self.proof_queue.tests_pending(worktree):
                raise Refusal(f"the tests of task {task.id} are running: your next task comes when they pass")
            if self.proof_queue.queue_proofs(worktree, context):
                return task
            self.close_checked(task, context)
            task = self.rows.required(Task, worktree.task_id)
        started_task = self.tasks.holder(context.actor.id).started().first()
        if task.state is not TaskState.STARTED and started_task is not None:
            self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.advance, task_id=started_task.id), context)
            return started_task
        following = self.tasks.next_delegated(context.actor.id)
        if following is None:
            raise Refusal(f"task {task.id} is your last", "journal worker deliver hands in all your tasks")
        if task.state is not TaskState.STARTED:
            return self.start_following(worktree, following, context)
        tested = self.repository.save_change(task, task.moved(TaskLifecycle.test), context)
        if self.phases.continues(tested, following):
            return self.start_following(worktree, following, context)
        phase = self.phases.phase(tested)
        if phase is not None:
            return self.submit_phase(worktree, tested, phase, context)
        if self.proof_queue.queue(worktree, context):
            return tested
        self.close_checked(tested, context)
        return self.start_following(worktree, following, context)

    def submit_phase(self, worktree: Worktree, task: Task, phase: Phase, context: Context) -> Task:
        for started in tuple(self.tasks.holder(context.actor.id).started().all_rows()):
            self.repository.save_change(started, started.moved(TaskLifecycle.test), context)
        if self.proof_queue.queue_phase(worktree, task, phase, context):
            return task
        self.results.finish(worktree, context)
        return self.rows.required(Task, self.rows.required(Worktree, worktree.id).task_id)

    def start_following(self, worktree: Worktree, following: Task, context: Context) -> Task:
        started = self.bus.dispatch(StartTask(following.id), context)
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.advance, task_id=following.id), context)
        return started

    def close_checked(self, task: Task, context: Context) -> None:
        proofs = tuple(self.queries.query(Proof).filter(task_id=task.id).all_rows())
        if proofs and all(proof.state is ProofState.CHECKED for proof in proofs):
            self.repository.save_change(task, task.close(context.timestamp, context.actor, "its proofs are checked"), context)
