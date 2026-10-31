from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.rules.support.task_write_count import TaskWriteCount
from core.base.agent_role import AgentRole

LOG_REQUEST_WRITES = 25


class LogRequestRule(DriverRule):
    """The write that reaches 25 writes since the task in hand was last logged names the task back and asks for
    a log line."""

    name = "tasks.log-request"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, task_writes: TaskWriteCount) -> None:
        self.task_writes = task_writes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        counted = self.task_writes.count(hook)
        if counted is None:
            return RuleAnswer.allowed()
        current, writes = counted
        if writes != LOG_REQUEST_WRITES:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(f"{LOG_REQUEST_WRITES} writes since you logged {current.name}: log where it stands with journal task log {current.task.id} \"<where it stands>\"")
