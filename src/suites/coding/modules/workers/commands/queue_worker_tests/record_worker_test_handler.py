from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test import RecordWorkerTest
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES, ProofState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.main_agent import MainAgent
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_TESTS_FAILED, WORKER_TESTS_PASSED



class RecordWorkerTestHandler(Handler[RecordWorkerTest, None]):
    """Checks a proof whose test passed, or sends it back short with the run's output to read. When a worker's
    last test has ended, failures go back to the worker, and all passed tells the main agent to merge."""

    command = RecordWorkerTest

    def __init__(self, queries: Queries, repository: Repository, main_agent: MainAgent) -> None:
        self.queries, self.repository, self.main_agent = queries, repository, main_agent

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
        else:
            self.main_agent.send_line(worktree.environment_id, WORKER_TESTS_PASSED.nudge(worker=worktree.agent_id).text, context)

    def reopen_work(self, worktree: Worktree, failed: list[Proof], context: Context) -> None:
        self.repository.save(self.queries.query(Task).find(worktree.task_id).moved(TaskLifecycle.retest), context)
        self.repository.save(worktree.moved(WorktreeLifecycle.rework), context)
        lines = "; ".join(f"{row.test_command} ({row.shortfall})" for row in failed)
        self.repository.save(AgentLine(agent_id=worktree.agent_id, creator_id=context.actor.id, text=WORKER_TESTS_FAILED.nudge(lines=lines).text, source=MERGE_CONFLICT_SOURCE), context)
