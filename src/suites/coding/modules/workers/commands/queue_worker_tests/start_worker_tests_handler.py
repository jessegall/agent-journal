from dataclasses import replace

import shlex
from suites.coding.modules.workers.support.proof_test_command import ProofTestCommand
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
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
from suites.coding.modules.workers.support.worker_test_start import WorkerTestStart
from suites.coding.modules.workers.support.checkout_libraries import CheckoutLibraries


class StartWorkerTestsHandler(Handler[StartWorkerTests, None]):
    """Moves queued proofs to running and makes their processes, owned by the worker that wrote them, so it reads
    their output; a later listener starts them once this is committed. They all go on the run queue at once
    and run on the commit handed in, in a checkout of its own, so the worker can go on working in its
    worktree. A checkout busy with tests of an older commit is never reused: the new proofs wait queued until
    it is free. A proof of a merged worktree is run by a checkpoint of its plan, on that run's checkout of the
    head of the environment's branch."""

    runs_once = True
    command = StartWorkerTests

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, worktrees: WorktreeQuery, proofs: ProofQuery, affected: AffectedTestRows, git: WorktreeGit, runner: CheckpointRunner, environments: EnvironmentRows, plans: TaskPlans, libraries: CheckoutLibraries) -> None:
        self.runner, self.environments, self.plans, self.libraries = runner, environments, plans, libraries
        self.queries, self.repository, self.bus = queries, repository, bus
        self.worktrees, self.proofs, self.affected, self.git = worktrees, proofs, affected, git

    def handle(self, command: StartWorkerTests, context: Context) -> None:
        # a worktree removed without its merge has no folder to test in, so its proofs never hold the others back
        test_rows, first_answers = self.proofs.test_rows(), self.affected.queued()
        listed = self.worktrees.worktrees_among([*(proof.worktree_id for proof in test_rows), *(first_answer.worktree_id for first_answer in first_answers)])
        worktrees = {worktree.id: worktree for worktree in listed if worktree.merged_at is not None or worktree.removed_at is None}
        proofs = [proof for proof in test_rows if proof.worktree_id in worktrees]
        running = {proof.worktree_id for proof in proofs if proof.state is ProofState.RUNNING}
        queued = [proof for proof in proofs if proof.state is ProofState.QUEUED]
        ready = {worktree_id for worktree_id in {proof.worktree_id for proof in queued} if self.is_ready(worktrees[worktree_id], running)}
        folders = {worktree_id: self.test_folder(worktrees[worktree_id], running) for worktree_id in ready}
        for members in self.run_groups([proof for proof in queued if proof.worktree_id in ready]):
            worktree_id = members[0].worktree_id
            process_id = self.start(members[0], worktrees[worktree_id], folders[worktree_id], ProofTestCommand.combined([proof.test_command for proof in members]), context)
            for proof in members[1:]:
                self.repository.save_change(proof, proof.moved(ProofLifecycle.run, process_id=process_id), context)
            running.add(worktree_id)
        for first_answer in first_answers:
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

    # the queued proofs of one worktree that run one test program over named files run as one run over all their
    # files; a proof that names no file runs alone, or with the proofs of the very same command
    @staticmethod
    def run_groups(proofs: list[Proof]) -> list[list[Proof]]:
        groups: dict[tuple[int, str], list[Proof]] = {}
        for proof in proofs:
            parsed = ProofTestCommand.parsed(proof.test_command)
            groups.setdefault((proof.worktree_id, shlex.join(parsed.program) if parsed.files else proof.test_command), []).append(proof)
        return list(groups.values())

    def start(self, proof: Proof, worktree: Worktree, folder: str, command: str, context: Context) -> int:
        start = WorkerTestStart.started(worktree.session_agent_id, command, folder)
        process = self.bus.dispatch(replace(start, owner_agent_id=worktree.session_agent_id, task_id=proof.task_id), context)
        self.repository.save_change(proof, proof.moved(ProofLifecycle.run, process_id=process.id), context)
        return process.id

    def start_picker(self, first_answer: AffectedTest, worktree: Worktree, context: Context) -> None:
        start = WorkerTestStart.started(worktree.session_agent_id, first_answer.picker_command, self.libraries.worker_checkout(worktree, self.git.merged_checkout(worktree)))
        process = self.bus.dispatch(replace(start, owner_agent_id=worktree.session_agent_id, task_id=first_answer.task_id), context)
        self.repository.update(first_answer, context, state=AffectedTestState.PICKING, process_id=process.id)
