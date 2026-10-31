from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.hook_call_query import HookCallQuery
from core.modules.tasks.tasks_in_hand import TasksInHand

LOG_HOLD_WRITES = 50


class LogHold(DriverRule):
    """Once 50 writes have been made since the task in hand was last logged, every further write waits for a log
    line; reads and journal commands go through."""

    name = "tasks.log-before-more-writes"
    hook = "pre_tool_use"
    drivers = ["*"]
    roles = ["main"]

    def __init__(self, in_hand: TasksInHand, calls: HookCallQuery) -> None:
        self.in_hand, self.calls = in_hand, calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool, held = hook.event.tool, self.in_hand.of(hook.agent_id)
        if tool is None or not tool.is_writing_files() or held is None:
            return RuleAnswer.allowed()
        if self.calls.writes_since(hook.agent_id, held.counted_from) + 1 < LOG_HOLD_WRITES:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(f"{LOG_HOLD_WRITES} writes since you logged {held.name}: writes wait for journal task log {held.task.id} \"<what was done>\"")
