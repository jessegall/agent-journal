from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.query.queries import Queries
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

REMINDER_SECONDS = 3600


class MergeCheckoutRule(DriverRule):
    """A tick tells the main agent once an hour which branch the checkout must be on for a checked merge."""

    name = "workers.merge-waits-for-checkout"
    hook = HookEventName.TICK
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = ["main"]

    def __init__(self, queries: Queries, delivered: WorkerWorktrees, proofs: ProofQuery, git: WorktreeGit, history: HookHistory) -> None:
        self.queries, self.delivered, self.proofs, self.git, self.hook_history = queries, delivered, proofs, git, history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        reminded_at = self.hook_history.answer_time(RuleHistoryKey(hook.agent_id, self.name, hook.layer_ref))
        if reminded_at is not None and reminded_at.elapsed_seconds(hook.timestamp) < REMINDER_SECONDS:
            return RuleAnswer.allowed()
        lines: list[str] = []
        for worktree in self.delivered.delivered(hook.agent_id):
            environment = self.queries.query(Environment).find(worktree.environment_id)
            if not self.proofs.waiting_proofs(worktree.id).exists() and self.git.head(environment.folder) != worktree.base_branch:
                lines.append(f"the merge of worker {worktree.agent_id} waits for the checkout of environment {environment.name} to return to"
                             f" {worktree.base_branch}")
        return RuleAnswer.with_lines(*lines) if lines else RuleAnswer.allowed()
