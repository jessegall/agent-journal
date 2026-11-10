from core.modules.tasks.support.task_nudges import LOG_REQUEST, LOG_REQUEST_WRITES
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.tasks.rules.support.task_write_count import TaskWriteCount
from engine.enums.role_group import RoleGroup


class LogRequestRule(DriverRule):
    """The write that reaches 25 writes since the task in hand was last logged names the task back and
    asks for a log line."""

    name = "tasks.log-request"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.TASK

    def __init__(self, task_writes: TaskWriteCount) -> None:
        self.task_writes = task_writes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        counted = self.task_writes.count(hook)
        if counted is None:
            return RuleAnswer.allowed()
        current, writes = counted
        if writes != LOG_REQUEST_WRITES:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(LOG_REQUEST.nudge(LOG_REQUEST_WRITES, task=current.task.id))
