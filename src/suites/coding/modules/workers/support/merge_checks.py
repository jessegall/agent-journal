from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery


class MergeChecks:
    """The row checks a merge passes before git runs: every proof checked, and the base branch unchanged."""

    def __init__(self, queries: Queries, proofs: ProofQuery) -> None:
        self.queries, self.proofs = queries, proofs

    def check_proofs(self, worktree: Worktree) -> None:
        unchecked = [str(proof.point) for proof in self.proofs.worktree_proofs(worktree.id).oldest().all_rows() if proof.state is not ProofState.CHECKED]
        if unchecked:
            raise Refusal(f"point {', '.join(unchecked)} is not checked", "journal proof check <proof> or journal proof short <proof> --shortfall \"<what is missing>\"")

    def check_base_branch(self, worktree: Worktree) -> None:
        environment = self.queries.query(Environment).find(worktree.environment_id)
        if worktree.base_branch != environment.branch:
            raise Refusal(f"environment {environment.name} now builds on {environment.branch}; worker worker-{worktree.agent_id} was cut from"
                          f" {worktree.base_branch}", "release it and dispatch the task again")
