from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.hook_call_query import HookCallQuery
from core.modules.tasks.tasks_in_hand import TasksInHand

LOG_REQUEST_WRITES = 25


class LogRequest(DriverRule):
    """The write that reaches 25 writes since the task in hand was last logged names the task back and asks for
    a log line."""

    name = "tasks.log-request"
    hook = "pre_tool_use"
    drivers = ["*"]
    roles = ["main"]

    def __init__(self, held_tasks: TasksInHand, calls: HookCallQuery) -> None:
        self.held_tasks, self.calls = held_tasks, calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool, held = hook.event.tool, self.held_tasks.of(hook.agent_id)
        if tool is None or not tool.is_writing_files() or held is None:
            return RuleAnswer.allowed()
        if self.calls.writes_since(hook.agent_id, held.counted_from) + 1 != LOG_REQUEST_WRITES:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(f"{LOG_REQUEST_WRITES} writes since you logged {held.name}: log where it stands with journal task log {held.task.id} \"<where it stands>\"")
