from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.hook_call_query import HookCallQuery
from core.modules.tasks.tasks_in_hand import TasksInHand

STOP_REFUSALS_PER_LOG = 3


class CarryOnRefusal(DriverRule):
    """A stop with a task in hand is refused and told to carry on, three times since the task was last logged;
    the stop after that goes through."""

    name = "tasks.carry-on-at-stop"
    hook = "stop"
    drivers = ["*"]
    roles = ["main"]

    def __init__(self, in_hand: TasksInHand, calls: HookCallQuery) -> None:
        self.in_hand, self.calls = in_hand, calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        held = self.in_hand.of(hook.agent_id)
        if held is None or self.calls.refused_stops_since(hook.agent_id, held.counted_from) >= STOP_REFUSALS_PER_LOG:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(f"{held.name}, is in hand: carry on, or log why it waits with journal task log {held.task.id} \"<why>\"")
