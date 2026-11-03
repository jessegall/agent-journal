from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.command_category import CommandCategory
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.commands.start_process.start_process import StartProcess
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests import StartWorkerTests
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES, ProofState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.main_agent import MainAgent

TEST_LIMIT_SECONDS = 3600


class StartWorkerTestsHandler(Handler[StartWorkerTests, None]):
    """Moves queued proofs to running and makes their processes, owned by the main agent, since a worker that has
    stopped would lose its runs; a later listener starts them once this is committed."""

    command = StartWorkerTests

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, main_agent: MainAgent) -> None:
        self.queries, self.repository, self.bus, self.main_agent = queries, repository, bus, main_agent

    def handle(self, command: StartWorkerTests, context: Context) -> None:
        worktrees = {worktree.id: worktree for worktree in self.queries.query(Worktree).filter(environment_id=command.environment_id).all_rows()}
        proofs = [proof for proof in self.queries.query(Proof).matching(Among("state", TEST_WAITING_STATES)).oldest().all_rows() if proof.worktree_id in worktrees]
        running = {proof.worktree_id for proof in proofs if proof.state is ProofState.RUNNING}
        owner = self.main_agent.running(command.environment_id)
        for proof in proofs:
            if owner is None:
                return
            if proof.state is ProofState.QUEUED and proof.worktree_id not in running:
                self.start(proof, worktrees[proof.worktree_id], owner.id, context)
                running.add(proof.worktree_id)

    def start(self, proof: Proof, worktree: Worktree, owner_id: int, context: Context) -> None:
        process = self.bus.dispatch(StartProcess.single_part(owner_id, proof.test_command, worktree.folder, CommandCategory.TEST_RUN, TEST_LIMIT_SECONDS, is_queued=True), context)
        self.repository.save(proof.moved(ProofLifecycle.run, process_id=process.id), context)
