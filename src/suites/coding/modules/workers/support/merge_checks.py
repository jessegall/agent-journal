from core.base.query.queries import Queries
from suites.coding.modules.workers.support.worker_log_lines import WorkerReview
from core.base.database.kept_rows import KeptRows
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.base.refusal import Refusal
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState


class MergeChecks:
    """The row checks a merge passes before git runs: every proof checked, and the base branch unchanged."""

    def __init__(self, queries: Queries, proofs: ProofQuery, kept: KeptRows, environments: EnvironmentRows) -> None:
        self.queries, self.proofs, self.kept, self.environments = queries, proofs, kept, environments

    def check_important_lines(self, worktree: Worktree, review: WorkerReview, answer: str) -> None:
        if review.has_important_lines() and not answer.strip():
            raise Refusal(f"worker {worktree.session_agent_id} has important log lines you have not answered",
                          f'read them with journal worker logs {worktree.session_agent_id}, then journal worker merge {worktree.session_agent_id} --read-important "<what you make of them>"')

    def check_logs(self, worktree: Worktree) -> None:
        if worktree.logs_read_at is None:
            raise Refusal(f"the logs of worker {worktree.session_agent_id} have not been read", f"journal worker logs {worktree.session_agent_id}")

    def check_proofs(self, worktree: Worktree) -> None:
        first_answer = self.kept.read("affected_tests", lambda: self.queries.query(AffectedTest).filter(worktree_id=worktree.id).newest().first(),
                                  "worktree_id = ?", [worktree.id], name="workers.merge_selected")
        if first_answer is not None and first_answer.state not in (AffectedTestState.PASSED, AffectedTestState.CANCELLED):
            raise Refusal("selected tests have not passed", "wait for the selected tests to finish")
        unchecked = [str(proof.point) for proof in self.kept.read("proofs", lambda: tuple(self.proofs.worktree_proofs(worktree.id).oldest().all_rows()),
                     "worktree_id = ?", [worktree.id], name="workers.merge_proofs") if proof.state is not ProofState.CHECKED]
        if unchecked:
            raise Refusal(f"point {', '.join(unchecked)} is not checked", "journal proof check <proof> or journal proof short <proof> --shortfall \"<what is missing>\"")

    def check_base_branch(self, worktree: Worktree) -> None:
        environment = self.environments.find(worktree.environment_id)
        if worktree.base_branch != environment.branch:
            raise Refusal(f"environment {environment.name} now builds on {environment.branch}; worker worker-{worktree.session_agent_id} was cut from"
                          f" {worktree.base_branch}", "release it and dispatch the task again")
