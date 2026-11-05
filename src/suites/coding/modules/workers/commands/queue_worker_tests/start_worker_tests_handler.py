from dataclasses import replace

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
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery

TEST_LIMIT_SECONDS = 3600


class StartWorkerTestsHandler(Handler[StartWorkerTests, None]):
    """Moves queued proofs to running and makes their processes, owned by the worker that wrote them, so it reads
    their output; a later listener starts them once this is committed."""

    command = StartWorkerTests

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, worktrees: WorktreeQuery) -> None:
        self.queries, self.repository, self.bus = queries, repository, bus
        self.worktrees = worktrees

    def handle(self, command: StartWorkerTests, context: Context) -> None:
        worktrees = {worktree.id: worktree for worktree in self.worktrees.all_worktrees()}
        proofs = [proof for proof in self.queries.query(Proof).matching(Among("state", TEST_WAITING_STATES)).oldest().all_rows() if proof.worktree_id in worktrees]
        running = {proof.worktree_id for proof in proofs if proof.state is ProofState.RUNNING}
        for proof in proofs:
            if proof.state is not ProofState.QUEUED or proof.worktree_id in running:
                continue
            self.start(proof, worktrees[proof.worktree_id], context)
            running.add(proof.worktree_id)
        for selected in self.queries.query(AffectedTest).filter(state=AffectedTestState.QUEUED).oldest().all_rows():
            if selected.worktree_id not in worktrees or selected.worktree_id in running:
                continue
            if any(proof.worktree_id == selected.worktree_id for proof in proofs):
                continue
            worktree = worktrees[selected.worktree_id]
            if self.queries.query(Proof).filter(worktree_id=worktree.id, state=ProofState.SHORT).exists():
                self.repository.update(selected, context, state=AffectedTestState.CANCELLED)
                continue
            self.start_picker(selected, worktree, context)

    def start(self, proof: Proof, worktree: Worktree, context: Context) -> None:
        start = StartProcess.single_part(worktree.session_agent_id, proof.test_command, worktree.folder, CommandCategory.TEST_RUN, TEST_LIMIT_SECONDS)
        process = self.bus.dispatch(replace(start, owner_agent_id=worktree.session_agent_id, task_id=proof.task_id), context)
        self.repository.save_change(proof, proof.moved(ProofLifecycle.run, process_id=process.id), context)

    def start_picker(self, selected: AffectedTest, worktree: Worktree, context: Context) -> None:
        start = StartProcess.single_part(worktree.session_agent_id, selected.picker_command, worktree.folder, CommandCategory.TEST_RUN, TEST_LIMIT_SECONDS)
        process = self.bus.dispatch(replace(start, owner_agent_id=worktree.session_agent_id, task_id=selected.task_id), context)
        self.repository.update(selected, context, state=AffectedTestState.PICKING, process_id=process.id)
