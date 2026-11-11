from collections import defaultdict

from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.return_checkpoint_tasks.return_checkpoint_tasks import ReturnCheckpointTasks
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test_handler import RecordWorkerTestHandler
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.checkpoint_failures import CheckpointFailures
from suites.coding.modules.workers.support.checkpoint_folders import CheckpointFolders
from suites.coding.modules.workers.support.failed_run import FailedRun
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.checkpoint_results import CheckpointResults
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.returned_tasks import ReturnedTasks
from suites.coding.modules.workers.support.worker_nudges import CHECKPOINT_FAILURE_FALLBACK

FAILURE_SOURCE = "workers.checkpoint-failure"
WORKER_RUN_SHORTFALL = "the tests of its checkpoint failed on your commit: outputs {outputs}"


class ReturnCheckpointTasksHandler(Handler[ReturnCheckpointTasks, tuple[ReturnedTasks, ...]]):
    """Opens again each completed task a failed run belongs to and gives back, for each worker whose merged
    work held such a task, the tasks it gets and the outputs of their failed tests. A task no worker held,
    or whose worker is retired, stays open for whoever takes it next. A failure that names no task is told
    to the merger in one line; the main agent hears nothing. A task whose work is not merged, as in a run
    the main agent started early, goes back to its worker in the worktree it has, as a failed test of a
    hand-in does. A failed worker run starts its failed tasks again in the worktree it tested, and only that
    worker is told."""

    command = ReturnCheckpointTasks
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, repository: Repository, results: CheckpointResults, worktrees: WorktreeQuery, inbox: MergerInbox, proofs: ProofQuery, test_results: RecordWorkerTestHandler, failures: CheckpointFailures,
                 folders: CheckpointFolders) -> None:
        self.failures, self.folders = failures, folders
        self.rows, self.repository, self.results, self.worktrees, self.inbox = rows, repository, results, worktrees, inbox
        self.proofs, self.test_results = proofs, test_results

    def handle(self, command: ReturnCheckpointTasks, context: Context) -> tuple[ReturnedTasks, ...]:
        reach = self.rows.required(CheckpointReach, command.reach_id)
        proofs = self.proofs.task_proofs(reach.tasks())
        failed = self.failures.read(reach, proofs, self.results.tests(reach))
        link = self.folders.link(reach)
        if link is not None:
            self.return_worker_run(self.rows.required(Worktree, link.worktree_id), failed, proofs, context)
            return ()
        tasks = self.rows.required_index(Task, failed.task_ids)
        worker_tasks = defaultdict[int, list[int]](list)
        self.return_unmerged([proof for proof in proofs if proof.state is ProofState.SHORT], context)
        for task in tasks.values():
            if task.state is not TaskState.COMPLETED:
                continue
            self.repository.save_change(task, task.reopen(context.timestamp, context.actor), context)
            worker = self.merged_worker(task.id)
            if worker is not None:
                worker_tasks[worker.id].append(task.id)
        if failed.fallback_task_id is not None:
            outputs = ", ".join(str(output_id) for output_id in failed.output_ids(tuple([failed.fallback_task_id])))
            self.inbox.send_nudge(CHECKPOINT_FAILURE_FALLBACK.nudge(phase=reach.phase_id, outputs=outputs, task=failed.fallback_task_id), FAILURE_SOURCE, context)
        return tuple(ReturnedTasks(worker_id, tuple(task_ids), failed.output_ids(task_ids)) for worker_id, task_ids in worker_tasks.items())

    def return_worker_run(self, worktree: Worktree, failed: FailedRun, proofs: tuple[Proof, ...], context: Context) -> None:
        task_ids = sorted(failed.task_ids)
        if not task_ids:
            return
        outputs = ", ".join(str(output_id) for output_id in failed.output_ids(tuple(task_ids)))
        for proof in proofs:
            if proof.task_id in task_ids and proof.state is not ProofState.SHORT:
                self.repository.save_change(proof, proof.moved(ProofLifecycle.short, shortfall=WORKER_RUN_SHORTFALL.format(outputs=outputs)), context)
        self.test_results.reopen_tasks(worktree, task_ids, outputs, context)

    def return_unmerged(self, short_proofs: list[Proof], context: Context) -> None:
        for worktree in self.worktrees.open_worktrees():
            worktree_proofs = [proof for proof in short_proofs if proof.worktree_id == worktree.id]
            if worktree_proofs:
                self.test_results.reopen_work(worktree, worktree_proofs, context)

    def merged_worker(self, task_id: int) -> Agent | None:
        merged = [worktree for worktree in self.worktrees.all_worktrees() if task_id in worktree.merged_tasks()]
        return self.kept_worker(merged[-1]) if merged else None

    def kept_worker(self, worktree: Worktree) -> Agent | None:
        worker = self.rows.required(Agent, worktree.session_agent_id)
        return None if worker.retired_at is not None else worker
