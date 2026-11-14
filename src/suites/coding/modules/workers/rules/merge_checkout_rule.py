from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.driver.nudge import Nudge
from suites.coding.modules.workers.support.worker_nudges import MERGE_WAITS
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.hook_history import HookHistory
from engine.driver.rule_answer import RuleAnswer
from engine.driver.seconds import Seconds
from engine.listener.rows.event_rows import EventRows
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from engine.enums.agent_role import AgentRole

REMINDER_SPAN = Seconds(3600)


class MergeCheckoutRule(DriverRule):
    """A tick tells the main agent once an hour which branch the checkout must be on for a checked merge."""

    name = "workers.merge-waits-for-checkout"
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, rows: EventRows, delivered: WorkerWorktrees, proofs: ProofQuery, git: WorktreeGit, history: HookHistory, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.rows, self.delivered, self.proofs, self.git, self.hook_history = rows, delivered, proofs, git, history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.hook_history.has_recent_answer(self.name, hook, REMINDER_SPAN):
            return RuleAnswer.allowed()
        nudges: list[Nudge] = []
        delivered = list(self.delivered.delivered())
        environments = self.rows.required_index(Environment, [worktree.environment_id for worktree in delivered])
        for worktree in delivered:
            environment = environments[worktree.environment_id]
            if not self.proofs.waiting_proofs(worktree.id).exists() and self.git.head(environment.folder) != worktree.base_branch:
                nudges.append(MERGE_WAITS.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id), environment=environment.name, branch=worktree.base_branch))
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
