from core.modules.tasks.support.task_nudges import TASK_RETURN
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from engine.agent.enums.role_group import RoleGroup
from core.modules.tasks.rules.support.current_tasks import CurrentTasks


class TaskReturnLineRule(DriverRule):
    """An agent that gets control back after an overlay silenced it is told which task it holds, if any."""

    name = "tasks.where-you-stand"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    role_group = RoleGroup.TASK
    history = True

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current = self.current_tasks.current(hook.agent_id) if hook.control_return else None
        return RuleAnswer.with_nudges(TASK_RETURN.nudge(task=current.task.id)) if current is not None else RuleAnswer.allowed()
