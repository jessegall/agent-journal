from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.hook_call_query import HookCallQuery
from core.modules.tasks.task import TaskState
from core.modules.tasks.task_query import TaskQuery

BLOCKED_TASKS_NAMED = 10


class BlockedWorkRefusal(DriverRule):
    """A stop with nothing in hand and nothing open, while tasks of the environment are blocked, is refused once
    to name them; the next stop goes through."""

    name = "tasks.blocked-work-at-stop"
    hook = "stop"
    drivers = ["*"]
    roles = ["main"]

    def __init__(self, tasks: TaskQuery, calls: HookCallQuery) -> None:
        self.tasks, self.calls = tasks, calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.tasks.held_by(hook.agent_id).started().exists() or self.tasks.environment(hook.environment_id).filter(state=TaskState.OPEN).exists():
            return RuleAnswer.allowed()
        blocked = self.tasks.environment(hook.environment_id).filter(state=TaskState.BLOCKED).oldest().page(1, BLOCKED_TASKS_NAMED).rows
        if not blocked or self.calls.refused_stop_streak(hook.agent_id) > 0:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(f"blocked tasks: {', '.join(str(task.id) for task in blocked)}: unblock what can go on with journal task unblock <n>, or stop again to leave them")
