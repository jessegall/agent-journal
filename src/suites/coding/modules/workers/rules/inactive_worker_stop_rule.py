from engine.enums.duration_unit import DurationUnit
from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.end_inactive_worker.end_inactive_worker import EndInactiveWorker
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.support.agent_activities import AgentActivities
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worker_nudges import WORKER_IDLE_STOPPED
from suites.coding.modules.workers.support.worker_settings import WORKER_IDLE_HOURS



class InactiveWorkerStopRule(DriverRule):
    """A tick stops the process of each worker of the main agent that has used no tool for the hours the setting
    gives and has delivered nothing. The worker stays kept: its task, its worktree and its session stay."""

    name = "workers.idle-worker-stop"
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorkerWorktrees, activities: AgentActivities, settings: SettingValues) -> None:
        self.worktrees, self.activities, self.settings = worktrees, activities, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        hours = self.settings.number(WORKER_IDLE_HOURS)
        activities = self.activities.read(hook)
        idle = [worktree for worktree in self.worktrees.main_worktrees() if worktree.state is WorktreeState.CUT and worktree.session_agent_id in activities and self.is_idle(activities[worktree.session_agent_id], hook, hours)]
        commands = [EndInactiveWorker(worktree.session_agent_id) for worktree in idle]
        return RuleAnswer.with_nudges(*(WORKER_IDLE_STOPPED.nudge(worker=worktree.session_agent_id, task=worktree.task_id) for worktree in idle)).running(*commands)

    def is_idle(self, worker: AgentActivity, hook: AgentHook, hours: int) -> bool:
        return worker.ended_at is None and worker.is_inactive(hook.timestamp, hours * DurationUnit.HOUR.seconds)
