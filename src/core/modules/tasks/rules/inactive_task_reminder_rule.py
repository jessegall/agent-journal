from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.interval import Interval
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.span_queries import SpanQueries
from core.base.timestamp import MINUTE_SECONDS
from core.modules.drivers.support.agent_activities import AgentActivities
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.support.task_nudges import INACTIVE_TASK
from core.modules.tasks.support.task_settings import QUIET_TASK_MINUTES


class InactiveTaskReminderRule(DriverRule):
    """A tick that finds an agent quiet for the quiet task minutes or more with a task in hand tells it to carry
    on or log why the task waits, once per quiet stretch."""

    name = "tasks.quiet-task"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, current_tasks: CurrentTasks, activities: AgentActivities, history: HookHistory, settings: SettingValues, spans: SpanQueries) -> None:
        self.current_tasks, self.activities, self.hook_history, self.settings, self.spans = current_tasks, activities, history, settings, spans

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current = self.current_tasks.current(hook.agent_id)
        if current is None:
            return RuleAnswer.allowed()
        newest_at = self.activities.read(hook)[hook.agent_id].last_hook_at
        if newest_at is None or self.hook_history.has_answered_since(self.name, hook, newest_at):
            return RuleAnswer.allowed()
        quiet = Interval(self.settings.minutes(QUIET_TASK_MINUTES))
        if not quiet.has_passed(self.spans, hook.agent_id, newest_at, hook.timestamp):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(INACTIVE_TASK.nudge(minutes=quiet.seconds // MINUTE_SECONDS, task=current.task.id))
