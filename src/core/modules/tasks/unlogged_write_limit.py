from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.task_write_count import TaskWriteCount

UNLOGGED_WRITES_CEILING = 50


class UnloggedWriteLimit(DriverRule):
    """Once 50 writes have been made since the task in hand was last logged, every further write waits for a log
    line; reads and journal commands go through."""

    name = "tasks.log-before-more-writes"
    hook = "pre_tool_use"
    drivers = ["*"]
    roles = ["main"]

    def __init__(self, task_writes: TaskWriteCount) -> None:
        self.task_writes = task_writes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        counted = self.task_writes.count(hook)
        if counted is None:
            return RuleAnswer.allowed()
        current, writes = counted
        if writes < UNLOGGED_WRITES_CEILING:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(f"{UNLOGGED_WRITES_CEILING} writes since you logged {current.name}: writes wait for journal task log {current.task.id} \"<what was done>\"")
