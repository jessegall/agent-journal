from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.agents.models.enums.agent_role import AgentRole
from core.modules.tasks.rules.support.current_tasks import CurrentTasks


class TaskReturnLineRule(DriverRule):
    """An agent that gets control back after an overlay silenced it is told which task it holds, if any."""

    name = "tasks.where-you-stand"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]
    history = True

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current = self.current_tasks.current(hook.agent_id) if hook.control_return else None
        return RuleAnswer.with_lines(f"back to {current.name}") if current is not None else RuleAnswer.allowed()
