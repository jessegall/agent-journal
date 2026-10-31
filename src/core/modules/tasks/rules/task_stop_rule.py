from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.tasks.rules.support.current_tasks import CurrentTasks

LOG_STOP_REFUSAL_COUNT = 3


class TaskStopRule(DriverRule):
    """A stop with a task in hand is refused and told to carry on, three times since the task was last logged;
    the stop after that goes through."""

    name = "tasks.carry-on-at-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = ["main"]

    def __init__(self, current_tasks: CurrentTasks, calls: HookCallQuery) -> None:
        self.current_tasks, self.calls = current_tasks, calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current = self.current_tasks.current(hook.agent_id)
        if current is None or self.calls.refused_stop_count(hook.agent_id, current.count_start) >= LOG_STOP_REFUSAL_COUNT:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(f"{current.name}, is in hand: carry on, or log why it waits with journal task log {current.task.id} \"<why>\"")
