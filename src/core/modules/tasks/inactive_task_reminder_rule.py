from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.hook_call_query import HookCallQuery
from core.modules.tasks.current_tasks import CurrentTasks

INACTIVE_MINUTES = 15
MINUTE_SECONDS = 60


class InactiveTaskReminderRule(DriverRule):
    """A tick that finds an agent quiet for 15 minutes or more with a task in hand tells it to carry on or log why
    the task waits, once per quiet stretch."""

    name = "tasks.quiet-task"
    hook = "tick"
    drivers = ["*"]
    roles = ["main"]

    def __init__(self, current_tasks: CurrentTasks, calls: HookCallQuery, history: HookHistory) -> None:
        self.current_tasks, self.calls, self.hook_history = current_tasks, calls, history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current, newest = self.current_tasks.current(hook.agent_id), self.calls.newest_agent_hook(hook.agent_id)
        if current is None or newest is None or newest.created_at is None:
            return RuleAnswer.allowed()
        reminded_at = self.hook_history.answer_time(RuleHistoryKey(hook.agent_id, self.name, hook.layer_ref))
        if reminded_at is not None and reminded_at >= newest.created_at:
            return RuleAnswer.allowed()
        if newest.created_at.elapsed_seconds(hook.timestamp) < INACTIVE_MINUTES * MINUTE_SECONDS:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(f"nothing has happened for {INACTIVE_MINUTES} minutes: carry on with {current.name}, or log why it waits")
