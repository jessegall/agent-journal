from core.base.actor import Actor
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
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


class DeliverTaskHandler(Handler[DeliverTask, Task]):
    """Hands in all a worker's tasks together, which a queued task refuses: commits its worktree, moves every
    task it holds started to testing, delivers the worktree and queues the tests of its proofs. On a phase
    of a started plan it queues the whole phase, and with nothing to run it finishes at once."""

    command = DeliverTask
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, worktrees: WorktreeQuery, proof_queue: WorkerProofQueue, repository: Repository, task_commit: WorkerTaskCommit, tasks: TaskQuery, queries: Queries, phases: WorkerPhases, results: RecordWorkerTestHandler, differences: DeliveryDifferences) -> None:
        self.rows, self.worktrees, self.proof_queue, self.repository, self.task_commit, self.tasks = rows, worktrees, proof_queue, repository, task_commit, tasks
        self.queries, self.phases, self.results, self.differences = queries, phases, results, differences

    def prepare(self, command: DeliverTask, actor: Actor) -> None:
        worktree = self.worktrees.worker_worktree(actor.id)
        if worktree is None or worktree.state is not WorktreeState.CUT:
            raise Refusal("only a worker with a started task delivers", "journal worker-worktree list shows the worktrees")
        following = self.tasks.next_delegated(actor.id)
        if following is not None:
            raise Refusal(f"task {following.id} is still in your queue, and all your tasks are handed in together", "journal worker next")
        self.task_commit.commit(worktree, self.queries.query(Task).find(worktree.task_id), actor)

    def handle(self, command: DeliverTask, context: Context) -> Task:
        committed = self.worktrees.worker_worktree(context.actor.id)
        self.differences.record(committed.task_id, command.differences, context)
        for started in tuple(self.tasks.holder(context.actor.id).started().all_rows()):
            self.repository.save_change(started, started.moved(TaskLifecycle.test), context)
        delivered = self.repository.save_change(committed, committed.moved(WorktreeLifecycle.deliver, logs_read_at=None, logs_output_id=None, tests_passed_at=None, left_to_main_at=None), context)
        task = self.rows.required(Task, committed.task_id)
        group = self.phases.group(delivered, task)
        if group is None:
            self.proof_queue.queue(delivered, context)
        elif not self.proof_queue.queue_group(delivered, task, group, context):
            self.results.finish(delivered, context)
        return self.rows.required(Task, committed.task_id)
