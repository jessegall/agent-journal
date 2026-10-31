from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.models.enums.task_state import TaskState

BLOCKED_TASK_PAGE_SIZE = 10


class BlockedWorkRule(DriverRule):
    """A stop with nothing in hand and nothing open, while tasks of the environment are blocked, is refused once
    to name them; the next stop goes through."""

    name = "tasks.blocked-work-at-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = ["main"]

    def __init__(self, tasks: TaskQuery, calls: HookCallQuery) -> None:
        self.tasks, self.calls = tasks, calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.tasks.holder(hook.agent_id).started().exists() or self.tasks.open_tasks(hook.environment_id).exists():
            return RuleAnswer.allowed()
        blocked = self.tasks.environment(hook.environment_id).filter(state=TaskState.BLOCKED).oldest().page(1, BLOCKED_TASK_PAGE_SIZE).rows
        if not blocked or self.calls.stop_refusal_count(hook.agent_id) > 0:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(f"blocked tasks: {', '.join(str(task.id) for task in blocked)}: unblock what can go on with journal task unblock <n>, or stop again to leave them")
