from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.base.agent_role import AgentRole


class TaskStopRule(DriverRule):
    """A stop with a task in hand is refused and told to carry on, every time."""

    name = "tasks.carry-on-at-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current = self.current_tasks.current(hook.agent_id)
        if current is None:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(f"{current.name}, is in hand: carry on, or block it with journal task block {current.task.id} --reason \"<why>\"")
