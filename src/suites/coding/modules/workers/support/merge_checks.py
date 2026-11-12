from engine.query.queries import Queries
from suites.coding.modules.workers.support.worker_review import WorkerReview
from engine.database.kept_rows import KeptRows
from core.modules.environments.support.environment_rows import EnvironmentRows
from engine.errors.refusal import Refusal
from collections.abc import Iterable

from core.modules.plans.support.task_plans import TaskPlans
from suites.coding.modules.workers.models.enums.proof_state import COMMITTED_WORK_MERGEABLE_STATES, MERGEABLE_STATES
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers


class MergeChecks:
    """The row checks a merge passes before git runs: every proof checked, and the base branch unchanged. In a
    started plan a committed proof passes too, since its test runs at a checkpoint of the plan, and the
    selected tests are not asked for: they run at the checkpoint as well."""

    def __init__(self, queries: Queries, proofs: ProofQuery, kept: KeptRows, environments: EnvironmentRows, numbers: RowNumbers, plans: TaskPlans) -> None:
        self.numbers, self.plans = numbers, plans
        self.queries, self.proofs, self.kept, self.environments = queries, proofs, kept, environments

    def check_important_lines(self, worktree: Worktree, review: WorkerReview, answer: str) -> None:
        if review.has_important_lines() and not answer.strip():
            raise Refusal(f"{AgentLabel.from_row_id(worktree.session_agent_id, self.numbers, "worker").text} has important log lines you have not answered",
                          f'read them with journal worker logs {worktree.session_agent_id}, then journal worker merge {worktree.session_agent_id} --read-important "<what you make of them>"')

    def check_logs(self, worktree: Worktree) -> None:
        if worktree.logs_read_at is None:
            raise Refusal(f"the logs of {AgentLabel.from_row_id(worktree.session_agent_id, self.numbers, "worker").text} have not been read", f"journal worker logs {AgentLabel.from_row_id(worktree.session_agent_id, self.numbers).number}")

    def check_proofs(self, worktree: Worktree) -> None:
        if not self.plans.is_started_plan(worktree.task_id):
            self.check_selected_tests(worktree)
        proofs = self.proofs.worktree_proofs(worktree.id).oldest()
        self.check_states(worktree, self.kept.read(proofs, lambda: tuple(proofs.all_rows()), name="workers.merge_proofs"))

    def check_states(self, worktree: Worktree, proofs: Iterable[Proof]) -> None:
        mergeable = COMMITTED_WORK_MERGEABLE_STATES if self.plans.is_started_plan(worktree.task_id) else MERGEABLE_STATES
        refused = [str(proof.point) for proof in proofs if proof.state not in mergeable]
        if refused:
            raise Refusal(f"point {', '.join(refused)} is not {' or '.join(mergeable)}", "journal proof check <proof> or journal proof short <proof> --shortfall \"<what is missing>\"")

    def check_selected_tests(self, worktree: Worktree) -> None:
        answers = self.queries.query(AffectedTest).filter(worktree_id=worktree.id).newest()
        first_answer = self.kept.read(answers, answers.first, name="workers.merge_selected")
        if first_answer is not None and first_answer.state not in (AffectedTestState.PASSED, AffectedTestState.CANCELLED):
            raise Refusal("selected tests have not passed", "wait for the selected tests to finish")

    def check_base_branch(self, worktree: Worktree) -> None:
        environment = self.environments.find(worktree.environment_id)
        if worktree.base_branch != environment.branch:
            raise Refusal(f"environment {environment.name} now builds on {environment.branch}; worker worker-{worktree.session_agent_id} was cut from"
                          f" {worktree.base_branch}", "release it and dispatch the task again")
