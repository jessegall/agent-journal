from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.commands.start_process.start_process import StartProcess
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests import StartWorkerTests
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.plans.support.task_plans import TaskPlans
from suites.coding.modules.workers.support.affected_test_rows import AffectedTestRows
from suites.coding.modules.workers.support.checkpoint_runner import CheckpointRunner
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.worker_settings import TEST_LIMIT_SECONDS


class StartWorkerTestsHandler(Handler[StartWorkerTests, None]):
    """Moves queued proofs to running and makes their processes, owned by the worker that wrote them, so it reads
    their output; a later listener starts them once this is committed. They all go on the run queue at once
    and run on the commit handed in, in a checkout of its own, so the worker can go on working in its
    worktree. A checkout busy with tests of an older commit is never reused: the new proofs wait queued until
    it is free. A proof of a merged worktree is run by a checkpoint of its plan, on that run's checkout of the
    head of the environment's branch."""

    runs_once = True
    command = StartWorkerTests

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, worktrees: WorktreeQuery, proofs: ProofQuery, affected: AffectedTestRows, git: WorktreeGit, runner: CheckpointRunner, environments: EnvironmentRows, plans: TaskPlans) -> None:
        self.runner, self.environments, self.plans = runner, environments, plans
        self.queries, self.repository, self.bus = queries, repository, bus
        self.worktrees, self.proofs, self.affected, self.git = worktrees, proofs, affected, git

    def handle(self, command: StartWorkerTests, context: Context) -> None:
        worktrees = {worktree.id: worktree for worktree in self.worktrees.all_worktrees()}
        proofs = [proof for proof in self.proofs.test_rows() if proof.worktree_id in worktrees]
        running = {proof.worktree_id for proof in proofs if proof.state is ProofState.RUNNING}
        queued = [proof for proof in proofs if proof.state is ProofState.QUEUED]
        ready = {worktree_id for worktree_id in {proof.worktree_id for proof in queued} if self.is_ready(worktrees[worktree_id], running)}
        folders = {worktree_id: self.test_folder(worktrees[worktree_id], running) for worktree_id in ready}
        for proof in (proof for proof in queued if proof.worktree_id in ready):
            self.start(proof, worktrees[proof.worktree_id], folders[proof.worktree_id], context)
            running.add(proof.worktree_id)
        for first_answer in self.affected.queued():
            if first_answer.worktree_id not in worktrees or first_answer.worktree_id in running:
                continue
            if any(proof.worktree_id == first_answer.worktree_id for proof in proofs):
                continue
            worktree = worktrees[first_answer.worktree_id]
            if self.proofs.has_short_proof(worktree.id):
                self.repository.update(first_answer, context, state=AffectedTestState.CANCELLED)
                continue
            self.start_picker(first_answer, worktree, context)

    # Whether the queued proofs of a worktree can start: a test checkout that still runs tests at an older commit is
    # never reused for a newer one, so they wait queued until it is free and is brought to their commit.
    def is_ready(self, worktree: Worktree, running: set[int]) -> bool:
        return worktree.merged_at is not None or worktree.id not in running or self.git.is_test_checkout_current(worktree)

    def test_folder(self, worktree: Worktree, running: set[int]) -> str:
        if worktree.merged_at is not None:
            return self.runner.folder(self.environments.find(worktree.environment_id), self.plans.find_phase(worktree.task_id).plan_id)
        return self.git.test_folder(worktree) if worktree.id in running else self.git.test_checkout(worktree)

    def start(self, proof: Proof, worktree: Worktree, folder: str, context: Context) -> None:
        start = StartProcess.single_part(worktree.session_agent_id, proof.test_command, folder, CommandCategory.TEST_RUN, TEST_LIMIT_SECONDS)
        process = self.bus.dispatch(replace(start, owner_agent_id=worktree.session_agent_id, task_id=proof.task_id), context)
        self.repository.save_change(proof, proof.moved(ProofLifecycle.run, process_id=process.id), context)

    def start_picker(self, first_answer: AffectedTest, worktree: Worktree, context: Context) -> None:
        start = StartProcess.single_part(worktree.session_agent_id, first_answer.picker_command, self.git.test_checkout(worktree), CommandCategory.TEST_RUN, TEST_LIMIT_SECONDS)
        process = self.bus.dispatch(replace(start, owner_agent_id=worktree.session_agent_id, task_id=first_answer.task_id), context)
        self.repository.update(first_answer, context, state=AffectedTestState.PICKING, process_id=process.id)
