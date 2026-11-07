from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.commands.remove_orphan_worktrees.remove_orphan_worktrees import RemoveOrphanWorktrees


class OrphanWorktreeRule(DriverRule):
    """On the tick that falls on the first minute of an hour, the worktrees no worker holds are swept away."""

    name = "workers.worktree-sweep"
    hook = HookEventName.TICK
    drivers = ["coding.builder", "coding.orchestrator", "coding.main"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if hook.timestamp.value.minute != 0:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(RemoveOrphanWorktrees())
