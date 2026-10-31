from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.hook_call_query import HookCallQuery
from core.modules.tasks.tasks_in_hand import TasksInHand

QUIET_MINUTES = 15
SECONDS_PER_MINUTE = 60


class QuietTaskReminder(DriverRule):
    """A tick that finds an agent quiet for 15 minutes or more with a task in hand tells it to carry on or log why
    the task waits, once per quiet stretch."""

    name = "tasks.quiet-task"
    hook = "tick"
    drivers = ["*"]
    roles = ["main"]

    def __init__(self, in_hand: TasksInHand, calls: HookCallQuery, history: HookHistory) -> None:
        self.in_hand, self.calls, self.history = in_hand, calls, history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        held, newest = self.in_hand.of(hook.agent_id), self.calls.newest_agent_hook(hook.agent_id)
        if held is None or newest is None or newest.created_at is None:
            return RuleAnswer.allowed()
        spoke_at = self.history.last_spoke_at(hook.agent_id, self.name, hook.layer_ref)
        if spoke_at is not None and spoke_at >= newest.created_at:
            return RuleAnswer.allowed()
        if newest.created_at.elapsed_seconds(hook.timestamp) < QUIET_MINUTES * SECONDS_PER_MINUTE:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(f"nothing has happened for {QUIET_MINUTES} minutes: carry on with {held.name}, or log why it waits")
