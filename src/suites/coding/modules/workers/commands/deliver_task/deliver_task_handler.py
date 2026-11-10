from engine.actor.actor import Actor
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from suites.coding.modules.workers.commands.deliver_task.deliver_task import DeliverTask
from suites.coding.modules.workers.support.delivery_differences import DeliveryDifferences
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test_handler import RecordWorkerTestHandler
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from suites.coding.modules.workers.support.worker_task_commit import WorkerTaskCommit
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.support.worker_free_task import WorkerFreeTask
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask


class DeliverTaskHandler(Handler[DeliverTask, Task]):
    """Hands in all a worker's tasks together, which a queued task refuses: commits its worktree, moves every
    task it holds started to testing, delivers the worktree and queues the tests of its proofs. On a phase
    of a started plan it queues the whole phase, and with nothing to run it finishes at once. The worker is
    given the next free task it may take, which it starts when this work is done."""

    command = DeliverTask
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, worktrees: WorktreeQuery, proof_queue: WorkerProofQueue, repository: Repository, task_commit: WorkerTaskCommit, tasks: TaskQuery, queries: Queries, phases: WorkerPhases, results: RecordWorkerTestHandler, differences: DeliveryDifferences, next_task: WorkerNextTask, free_task: WorkerFreeTask, guidance: WorkerGuidance) -> None:
        self.next_task, self.free_task, self.guidance = next_task, free_task, guidance
        self.rows, self.worktrees, self.proof_queue, self.repository, self.task_commit, self.tasks = rows, worktrees, proof_queue, repository, task_commit, tasks
        self.queries, self.phases, self.results, self.differences = queries, phases, results, differences

    def check_rows(self, command: DeliverTask, actor: Actor) -> None:
        worktree = self.worktrees.worker_worktree(actor.id)
        if worktree is None or worktree.state is not WorktreeState.CUT or self.guidance.point(actor.id).step is WorkerStep.BLOCKED:
            raise Refusal(self.guidance.line(actor.id))
        following = self.next_task.following(actor.id)
        if following is not None:
            raise Refusal(f"task {following.id} is still in your queue, and all your tasks are handed in together", AskTopic.GENERAL.hint("journal worker next"))
        current = self.rows.required(Task, worktree.task_id)
        if current.state is TaskState.STARTED:
            self.task_commit.check_proofs(worktree, current)

    def prepare(self, command: DeliverTask, actor: Actor) -> None:
        self.check_rows(command, actor)
        worktree = self.worktrees.required_worker_worktree(actor.id)
        self.task_commit.commit(worktree, self.rows.required(Task, worktree.task_id), actor, command.differences)

    def handle(self, command: DeliverTask, context: Context) -> Task:
        committed = self.worktrees.required_worker_worktree(context.actor.id)
        self.differences.record(committed.task_id, command.differences, context)
        self.free_task.give_next(context.actor.id, context)
        for started in tuple(self.tasks.holder(context.actor.id).started().all_rows()):
            self.repository.save_change(started, started.moved(TaskLifecycle.test), context)
        delivered = self.repository.save_change(committed, committed.moved(WorktreeLifecycle.deliver, delivered_at=context.timestamp, logs_read_at=None, logs_output_id=None, tests_passed_at=None, returned_at=None), context)
        task = self.rows.required(Task, committed.task_id)
        group = self.phases.group(delivered, task)
        queued = self.proof_queue.queue(delivered, context) if group is None else self.proof_queue.queue_group(delivered, task, group, context)
        if not queued:
            self.results.finish(delivered, context)
        return self.rows.required(Task, committed.task_id)
