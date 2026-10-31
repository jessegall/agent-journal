from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees

INACTIVE_MINUTES = 5
MINUTE_SECONDS = 60


class InactiveWorkerRule(DriverRule):
    """A tick names to the main agent each worker that has used no tool for five minutes, again every five minutes."""

    name = "workers.inactive-worker"
    hook = HookEventName.TICK
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = ["main"]

    def __init__(self, queries: Queries, worktrees: WorkerWorktrees, calls: HookCallQuery, history: HookHistory) -> None:
        self.queries, self.worktrees, self.calls, self.hook_history = queries, worktrees, calls, history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        reminded_at = self.hook_history.answer_time(RuleHistoryKey(hook.agent_id, self.name, hook.layer_ref))
        if reminded_at is not None and reminded_at.elapsed_seconds(hook.timestamp) < INACTIVE_MINUTES * MINUTE_SECONDS:
            return RuleAnswer.allowed()
        lines = [line for line in (self.inactive_line(worktree, hook) for worktree in self.worktrees.main_worktrees(hook.agent_id)) if line]
        return RuleAnswer.with_lines(*lines) if lines else RuleAnswer.allowed()

    def inactive_line(self, worktree: Worktree, hook: AgentHook) -> str:
        worker = self.queries.query(Agent).find(worktree.agent_id)
        newest = self.calls.newest_agent_hook(worker.id)
        activity_at = newest.created_at if newest is not None else worker.created_at
        if worker.ended_at is not None or activity_at is None or activity_at.elapsed_seconds(hook.timestamp) < INACTIVE_MINUTES * MINUTE_SECONDS:
            return ""
        tool = f" on {newest.tool}" if newest is not None and newest.tool else ""
        last = f"its last hook was {newest.hook}{tool}" if newest is not None else "it has sent no hook yet"
        waiting = "your checks of its proofs" if worktree.state is WorktreeState.DELIVERED else f"nothing the journal knows of while task {worktree.task_id} is started"
        return f"worker {worker.id} has used no tool for {INACTIVE_MINUTES} minutes: {last}, and it waits on {waiting}"
