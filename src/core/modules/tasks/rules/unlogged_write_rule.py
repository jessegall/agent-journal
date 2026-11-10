from core.modules.tasks.support.task_nudges import UNLOGGED_WRITES
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.tasks.rules.support.task_write_count import TaskWriteCount
from engine.enums.role_group import RoleGroup
from core.modules.tasks.support.block_conditions.task_logged import TaskLogged
from core.modules.drivers.support.block_conditions.any_condition import AnyCondition
from core.modules.tasks.support.block_conditions.task_stopped import TaskStopped

UNLOGGED_WRITES_CEILING = 50


class UnloggedWriteRule(DriverRule):
    """Once 50 writes have been made since the task in hand was last logged, the agent is blocked until
    the task gets a log line."""

    name = "tasks.log-before-more-writes"
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
        if writes < UNLOGGED_WRITES_CEILING:
            return RuleAnswer.allowed()
        return RuleAnswer.blocked(hook, UNLOGGED_WRITES.nudge(task=current.task.id), AnyCondition(TaskLogged(current.task.id), TaskStopped(current.task.id)))
