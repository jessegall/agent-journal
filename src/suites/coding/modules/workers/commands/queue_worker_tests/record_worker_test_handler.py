from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.support.nudger import Nudger
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test import RecordWorkerTest
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES, ProofState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_TESTS_FAILED, WORKER_TESTS_PASSED
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance

LINE_SOURCE = "workers"



class RecordWorkerTestHandler(Handler[RecordWorkerTest, None]):
    """Checks a proof whose test passed, or sends it back short with the run's output to read. When a worker's
    last test has ended, failures go back to the worker; all passed completes the tasks they prove and starts
    its next task, or, once handed in, tells the main agent to merge."""

    command = RecordWorkerTest
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, main_agent_line: MainAgentLine, tasks: TaskQuery, advance: WorkerTaskAdvance, nudger: Nudger) -> None:
        self.queries, self.repository, self.main_agent_line, self.tasks, self.advance, self.nudger = queries, repository, main_agent_line, tasks, advance, nudger

    def handle(self, command: RecordWorkerTest, context: Context) -> None:
        proof = self.queries.query(Proof).find(command.proof_id)
        self.repository.save(proof.moved(ProofLifecycle.check) if command.passed else proof.moved(ProofLifecycle.short, shortfall=command.output_note), context)
        worktree = self.queries.query(Worktree).find(proof.worktree_id)
        proofs = tuple(self.queries.query(Proof).filter(worktree_id=worktree.id).all_rows())
        if any(row.state in TEST_WAITING_STATES for row in proofs):
            return
        failed = [row for row in proofs if row.state is ProofState.SHORT]
        if failed:
            self.reopen_work(worktree, failed, context)
            return
        self.complete_tested(proofs, context)
        if worktree.state is WorktreeState.CUT:
            self.start_next(worktree, context)
        else:
            self.main_agent_line.send(worktree.environment_id, WORKER_TESTS_PASSED.nudge(worker=worktree.agent_id).text, LINE_SOURCE, context)

    def complete_tested(self, proofs: tuple[Proof, ...], context: Context) -> None:
        for task_id in sorted({row.task_id for row in proofs if row.test_command}):
            task = self.queries.query(Task).find(task_id)
            if task.state is TaskState.TESTING and all(row.state is ProofState.CHECKED for row in proofs if row.task_id == task_id and row.test_command):
                self.repository.save(task.close(context.timestamp, context.actor, "its tests passed"), context)

    def start_next(self, worktree: Worktree, context: Context) -> None:
        started_task = next(iter(self.tasks.holder(worktree.agent_id).started().page(1, 1).rows), None)
        if started_task is not None:
            self.repository.save(worktree.moved(WorktreeLifecycle.advance, task_id=started_task.id), context)
            return
        following = self.tasks.next_delegated(worktree.agent_id)
        if following is None:
            return
        self.advance.after_passed_tests(worktree, following, context)

    def reopen_work(self, worktree: Worktree, failed: list[Proof], context: Context) -> None:
        for task_id in sorted({row.task_id for row in failed}):
            task = self.queries.query(Task).find(task_id)
            if task.state is TaskState.TESTING:
                self.repository.save(task.moved(TaskLifecycle.retest), context)
        if worktree.state is WorktreeState.DELIVERED:
            self.repository.save(worktree.moved(WorktreeLifecycle.rework), context)
        outputs = ", ".join(str(row.process_id) for row in failed)
        self.nudger.send(worktree.agent_id, WORKER_TESTS_FAILED, MERGE_CONFLICT_SOURCE, context, outputs=outputs)
