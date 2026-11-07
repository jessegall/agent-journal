from core.modules.tasks.support.task_nudges import INACTIVE_TASK
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.support.agent_activities import AgentActivities
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.base.agent_role import AgentRole
from core.base.timestamp import MINUTE_SECONDS

INACTIVE_MINUTES = 15


class InactiveTaskReminderRule(DriverRule):
    """A tick that finds an agent quiet for 15 minutes or more with a task in hand tells it to carry on or
    log why the task waits, once per quiet stretch."""

    name = "tasks.quiet-task"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, current_tasks: CurrentTasks, activities: AgentActivities, history: HookHistory) -> None:
        self.current_tasks, self.activities, self.hook_history = current_tasks, activities, history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current = self.current_tasks.current(hook.agent_id)
        if current is None:
            return RuleAnswer.allowed()
        newest_at = self.activities.read(hook)[hook.agent_id].last_hook_at
        if newest_at is None:
            return RuleAnswer.allowed()
        reminded_at = self.hook_history.last_answer(self.name, hook)
        if reminded_at is not None and reminded_at >= newest_at:
            return RuleAnswer.allowed()
        if newest_at.elapsed_seconds(hook.timestamp) < INACTIVE_MINUTES * MINUTE_SECONDS:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(INACTIVE_TASK.nudge(minutes=INACTIVE_MINUTES, task=current.task.id))
