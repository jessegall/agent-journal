from suites.coding.modules.workers.support.worker_nudges import WORKER_INACTIVE
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from core.base.agent_role import AgentRole

INACTIVE_MINUTES = 5
MINUTE_SECONDS = 60


class InactiveWorkerRule(DriverRule):
    """A tick names to the main agent each worker that has used no tool for five minutes, again every five minutes."""

    name = "workers.inactive-worker"
    hook = HookEventName.TICK
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, worktrees: WorkerWorktrees, calls: HookCallQuery, history: HookHistory) -> None:
        self.queries, self.worktrees, self.calls, self.hook_history = queries, worktrees, calls, history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        reminded_at = self.hook_history.answer_time(RuleHistoryKey(hook.agent_id, self.name, hook.layer_ref))
        if reminded_at is not None and reminded_at.elapsed_seconds(hook.timestamp) < INACTIVE_MINUTES * MINUTE_SECONDS:
            return RuleAnswer.allowed()
        inactive_worktrees = [worktree for worktree in self.worktrees.main_worktrees(hook.agent_id) if self.is_inactive(worktree, hook)]
        return RuleAnswer.with_nudges(*(WORKER_INACTIVE.nudge(worker=worktree.agent_id, minutes=INACTIVE_MINUTES) for worktree in inactive_worktrees))

    def is_inactive(self, worktree: Worktree, hook: AgentHook) -> bool:
        worker = self.queries.query(Agent).find(worktree.agent_id)
        newest = self.calls.newest_agent_hook(worker.id)
        activity_at = newest.created_at if newest is not None else worker.created_at
        return worker.ended_at is None and activity_at is not None and activity_at.elapsed_seconds(hook.timestamp) >= INACTIVE_MINUTES * MINUTE_SECONDS
