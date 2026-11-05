from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.support.agent_activities import AgentActivities
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.commands.release_worker.release_worker import ReleaseWorker
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worker_nudges import WORKER_RETIRED
from suites.coding.modules.workers.support.worker_settings import WORKER_IDLE_HOURS

HOUR_SECONDS = 3600


class InactiveWorkerRetireRule(DriverRule):
    """A tick retires each worker of the main agent that has used no tool for the hours the setting gives and
    has delivered nothing: its task opens again, its worktree is removed and the worker ends."""

    name = "workers.idle-worker-retire"
    hook = HookEventName.TICK
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorkerWorktrees, activities: AgentActivities, settings: SettingValues) -> None:
        self.worktrees, self.activities, self.settings = worktrees, activities, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        hours = self.settings.number(WORKER_IDLE_HOURS, hook.environment_id)
        activities = self.activities.read(hook)
        idle = [worktree for worktree in self.worktrees.main_worktrees(hook.agent_id) if worktree.state is WorktreeState.CUT and self.is_idle(activities[worktree.agent_id], hook, hours)]
        commands = [command for worktree in idle for command in (ReleaseWorker(worktree.agent_id, f"idle for {hours} hours"), EndAgent(worktree.agent_id))]
        return RuleAnswer.with_nudges(*(WORKER_RETIRED.nudge(worker=worktree.agent_id, task=worktree.task_id) for worktree in idle)).running(*commands)

    def is_idle(self, worker: AgentActivity, hook: AgentHook, hours: int) -> bool:
        return worker.ended_at is None and worker.is_inactive(hook.timestamp, hours * HOUR_SECONDS)
