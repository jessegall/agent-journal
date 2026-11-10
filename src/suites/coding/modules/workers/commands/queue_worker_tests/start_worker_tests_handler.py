from dataclasses import replace

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.command_category import CommandCategory
from engine.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.commands.start_process.start_process import StartProcess
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests import StartWorkerTests
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.affected_test_rows import AffectedTestRows
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.worker_settings import TEST_LIMIT_SECONDS


class StartWorkerTestsHandler(Handler[StartWorkerTests, None]):
    """Moves queued proofs to running and makes their processes, owned by the worker that wrote them, so it
    reads their output; a later listener starts them once this is committed. They all go on the run queue at
    once and run on the commit handed in, in a checkout of its own, so the worker can go on working in its
    worktree."""

    runs_once = True
    command = StartWorkerTests

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, worktrees: WorktreeQuery, proofs: ProofQuery, affected: AffectedTestRows, git: WorktreeGit) -> None:
        self.queries, self.repository, self.bus = queries, repository, bus
        self.worktrees, self.proofs, self.affected, self.git = worktrees, proofs, affected, git

    def handle(self, command: StartWorkerTests, context: Context) -> None:
        worktrees = {worktree.id: worktree for worktree in self.worktrees.all_worktrees()}
        proofs = [proof for proof in self.proofs.test_rows() if proof.worktree_id in worktrees]
        running = {proof.worktree_id for proof in proofs if proof.state is ProofState.RUNNING}
        queued = [proof for proof in proofs if proof.state is ProofState.QUEUED]
        folders = {worktree_id: self.git.test_folder(worktrees[worktree_id]) if worktree_id in running else self.git.test_checkout(worktrees[worktree_id])
                   for worktree_id in {proof.worktree_id for proof in queued}}
        for proof in queued:
            self.start(proof, worktrees[proof.worktree_id], folders[proof.worktree_id], context)
            running.add(proof.worktree_id)
        for first_answer in self.affected.queued():
            if first_answer.worktree_id not in worktrees or first_answer.worktree_id in running:
                continue
            if any(proof.worktree_id == first_answer.worktree_id for proof in proofs):
                continue
            worktree = worktrees[first_answer.worktree_id]
            if self.queries.query(Proof).filter(worktree_id=worktree.id, state=ProofState.SHORT).exists():
                self.repository.update(first_answer, context, state=AffectedTestState.CANCELLED)
                continue
            self.start_picker(first_answer, worktree, context)

    def start(self, proof: Proof, worktree: Worktree, folder: str, context: Context) -> None:
        start = StartProcess.single_part(worktree.session_agent_id, proof.test_command, folder, CommandCategory.TEST_RUN, TEST_LIMIT_SECONDS)
        process = self.bus.dispatch(replace(start, owner_agent_id=worktree.session_agent_id, task_id=proof.task_id), context)
        self.repository.save_change(proof, proof.moved(ProofLifecycle.run, process_id=process.id), context)

    def start_picker(self, first_answer: AffectedTest, worktree: Worktree, context: Context) -> None:
        start = StartProcess.single_part(worktree.session_agent_id, first_answer.picker_command, self.git.test_checkout(worktree), CommandCategory.TEST_RUN, TEST_LIMIT_SECONDS)
        process = self.bus.dispatch(replace(start, owner_agent_id=worktree.session_agent_id, task_id=first_answer.task_id), context)
        self.repository.update(first_answer, context, state=AffectedTestState.PICKING, process_id=process.id)
