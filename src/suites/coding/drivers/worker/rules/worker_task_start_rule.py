from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.queries.task_query import TaskQuery


class WorkerTaskStartRule(DriverRule):
    """A worker with no started task runs journal commands only, until the journal starts its task."""

    name = "workers.journal-only-without-task"
    hook = HookEventName.PRE_TOOL_USE

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or (tool.shell is not None and tool.shell.is_journal_line) or self.tasks.holder(hook.agent_id).started().exists():
            return RuleAnswer.allowed()
        return RuleAnswer.refused("your task has not started yet: only journal commands run until it does")
