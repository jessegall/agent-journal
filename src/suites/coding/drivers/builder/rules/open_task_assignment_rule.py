from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.task_query import TaskQuery
from core.modules.tasks.task_start import TaskStart


class OpenTaskAssignmentRule(DriverRule):
    """A builder that stops with no task started is given the oldest open task of its environment, started as its
    own, and goes on with it."""

    name = "coding.builder-next-task-at-stop"
    hook = HookEventName.STOP

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.tasks.holder(hook.agent_id).started().exists():
            return RuleAnswer.allowed()
        open_tasks = self.tasks.open_tasks(hook.environment_id).oldest().page(1, 1).rows
        if not open_tasks:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(f"task {open_tasks[0].id} is yours now: {open_tasks[0].title}").running(TaskStart(open_tasks[0].id))
