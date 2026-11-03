from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.commands.release_worker.release_worker import ReleaseWorker
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worker_nudges import WORKER_RETIRED
from suites.coding.modules.workers.support.worker_settings import WORKER_IDLE_HOURS

HOUR_SECONDS = 3600


class IdleWorkerRetireRule(DriverRule):
    """A tick retires each worker of the main agent that has used no tool for the hours the setting gives and
    has delivered nothing: its task opens again, its worktree is removed and the worker ends."""

    name = "workers.idle-worker-retire"
    hook = HookEventName.TICK
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]

    def __init__(self, worktrees: WorkerWorktrees, queries: Queries, calls: HookCallQuery, settings: SettingValues) -> None:
        self.worktrees, self.queries, self.calls, self.settings = worktrees, queries, calls, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        hours = self.settings.number(WORKER_IDLE_HOURS, hook.environment_id)
        idle = [worktree for worktree in self.worktrees.main_worktrees(hook.agent_id) if worktree.state is WorktreeState.CUT and self.is_idle(worktree, hook, hours)]
        commands = [command for worktree in idle for command in (ReleaseWorker(worktree.agent_id, f"idle for {hours} hours"), EndAgent(worktree.agent_id))]
        return RuleAnswer.with_nudges(*(WORKER_RETIRED.nudge(worker=worktree.agent_id, task=worktree.task_id) for worktree in idle)).running(*commands)

    def is_idle(self, worktree: Worktree, hook: AgentHook, hours: int) -> bool:
        worker = self.queries.query(Agent).find(worktree.agent_id)
        newest = self.calls.newest_agent_hook(worker.id)
        activity_at = newest.created_at if newest is not None else worker.created_at
        return worker.ended_at is None and activity_at is not None and activity_at.elapsed_seconds(hook.timestamp) >= hours * HOUR_SECONDS
