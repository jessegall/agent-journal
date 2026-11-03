from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.commands.sweep_worktrees.sweep_worktrees import SweepWorktrees


class WorktreeSweepRule(DriverRule):
    """On the tick that falls on the first minute of an hour, the worktrees no worker holds are swept away."""

    name = "workers.worktree-sweep"
    hook = HookEventName.TICK
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if hook.timestamp.value.minute != 0:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(SweepWorktrees(hook.environment_id))
