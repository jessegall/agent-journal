import shlex

from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.plans.support.task_plans import TaskPlans
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.affected_test_rows import AffectedTestRows
from suites.coding.modules.workers.support.checkout_libraries import CheckoutLibraries
from suites.coding.modules.workers.support.checkpoint_runner import CheckpointRunner
from suites.coding.modules.workers.support.proof_test_command import ProofTestCommand
from suites.coding.modules.workers.support.worker_test_plan import PickerRun, ProofRun, WorkerTestPlan
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class WorkerTestPlanner:
    """Decides which queued worker tests start and makes their checkouts, outside any write. They all go on the run
    queue at once and run on the commit handed in, in a checkout of its own, so the worker can go on working in its
    worktree. A checkout busy with tests of an older commit is never reused: the new proofs wait queued until it is
    free. A proof of a merged worktree is run by a checkpoint of its plan, on that run's checkout of the head of the
    environment's branch. A worktree removed without its merge has no folder to test in, so its proofs never hold
    the others back."""

    def __init__(self, worktrees: WorktreeQuery, proofs: ProofQuery, affected: AffectedTestRows, git: WorktreeGit, runner: CheckpointRunner, environments: EnvironmentRows,
                 plans: TaskPlans, libraries: CheckoutLibraries) -> None:
        self.worktrees, self.proofs, self.affected, self.git = worktrees, proofs, affected, git
        self.runner, self.environments, self.plans, self.libraries = runner, environments, plans, libraries

    def planned(self) -> WorkerTestPlan:
        test_rows, first_answers = self.proofs.test_rows(), self.affected.queued()
        listed = self.worktrees.worktrees_among([*(proof.worktree_id for proof in test_rows), *(first_answer.worktree_id for first_answer in first_answers)])
        worktrees = {worktree.id: worktree for worktree in listed if worktree.merged_at is not None or worktree.removed_at is None}
        proofs = [proof for proof in test_rows if proof.worktree_id in worktrees]
        running = {proof.worktree_id for proof in proofs if proof.state is ProofState.RUNNING}
        queued = [proof for proof in proofs if proof.state is ProofState.QUEUED]
        ready = {worktree_id for worktree_id in {proof.worktree_id for proof in queued} if self.is_ready(worktrees[worktree_id], running)}
        folders = {worktree_id: self.test_folder(worktrees[worktree_id], running) for worktree_id in ready}
        proof_runs = tuple(ProofRun(tuple(proof.id for proof in members), folders[members[0].worktree_id], ProofTestCommand.combined([proof.test_command for proof in members]))
                           for members in self.run_groups([proof for proof in queued if proof.worktree_id in ready]))
        busy = running | ready
        waiting = [first_answer for first_answer in first_answers
                   if first_answer.worktree_id in worktrees and first_answer.worktree_id not in busy and not any(proof.worktree_id == first_answer.worktree_id for proof in proofs)]
        short = {first_answer.id for first_answer in waiting if self.proofs.has_short_proof(first_answer.worktree_id)}
        picker_runs = tuple(self.picker_run(first_answer, worktrees[first_answer.worktree_id]) for first_answer in waiting if first_answer.id not in short)
        return WorkerTestPlan(proof_runs, picker_runs, tuple(sorted(short)))

    # the picker runs on the worktree's commits merged into its base, over the files those commits changed
    def picker_run(self, first_answer: AffectedTest, worktree: Worktree) -> PickerRun:
        folder = self.libraries.worker_checkout(worktree, self.git.merged_checkout(worktree))
        return PickerRun(first_answer.id, folder, shlex.join([*shlex.split(first_answer.picker_command), *self.git.committed_files(worktree)]))

    # Whether the queued proofs of a worktree can start: a test checkout that still runs tests at an older commit is
    # never reused for a newer one, so they wait queued until it is free and is brought to their commit.
    def is_ready(self, worktree: Worktree, running: set[int]) -> bool:
        return worktree.merged_at is not None or worktree.id not in running or self.git.is_test_checkout_current(worktree)

    def test_folder(self, worktree: Worktree, running: set[int]) -> str:
        if worktree.merged_at is not None:
            return self.runner.folder(self.environments.find(worktree.environment_id), self.plans.find_phase(worktree.task_id).plan_id)
        # a test checkout made new has only the committed files: the worktree's library copies and links are given to
        # it as to the picker's, and one already holding them is left as it is
        return self.git.test_folder(worktree) if worktree.id in running else self.libraries.worker_checkout(worktree, self.git.test_checkout(worktree))

    # the queued proofs of one worktree that run one test program over named files run as one run over all their
    # files, those that run one Go package with different -run filters as one run with the filters joined; any other
    # proof that names no file runs alone, or with the proofs of the very same command
    @staticmethod
    def run_groups(proofs: list[Proof]) -> list[list[Proof]]:
        groups: dict[tuple[int, str], list[Proof]] = {}
        for proof in proofs:
            parsed = ProofTestCommand.parsed(proof.test_command)
            groups.setdefault((proof.worktree_id, shlex.join(parsed.program) if parsed.files else ProofTestCommand.filter_key(proof.test_command)), []).append(proof)
        return list(groups.values())
