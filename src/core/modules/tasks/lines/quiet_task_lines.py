from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.agent_machine.needs.line_history import LineHistory
from engine.driver.hook_event import HookEvent
from engine.driver.interval import Interval
from engine.driver.nudge import Nudge
from engine.driver.span_queries import SpanQueries
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from engine.time.timestamp import MINUTE_SECONDS
from core.modules.drivers.support.agent_activities import AgentActivities
from core.modules.tasks.nudges.inactive_task_nudge import InactiveTaskNudge
from core.modules.tasks.support.current_tasks import CurrentTasks
from core.modules.tasks.support.task_settings import SILENT_TASK_MINUTES


class QuietTaskLines(EventLineSource):
    """A minute step that finds the main agent quiet for the quiet task minutes or more with a task in hand tells
    it to carry on or log why the task waits, once per quiet stretch."""

    key = "tasks.quiet-task"
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, current_tasks: CurrentTasks, activities: AgentActivities, history: LineHistory, settings: SettingValues, spans: SpanQueries, clock: Clock) -> None:
        self.current_tasks, self.activities, self.history, self.settings, self.spans, self.clock = current_tasks, activities, history, settings, spans, clock

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        current = self.current_tasks.current(agent_id)
        if current is None:
            return []
        newest_at = self.activities.read(event, agent_id)[agent_id].last_hook_at
        spoke_at = self.history.last_spoke(self.key, agent_id)
        if newest_at is None or (spoke_at is not None and spoke_at >= newest_at):
            return []
        silent = Interval(self.settings.minutes(SILENT_TASK_MINUTES))
        if not silent.has_passed(self.spans, agent_id, newest_at, self.clock.timestamp()):
            return []
        return [InactiveTaskNudge.declared().nudge(minutes=silent.seconds // MINUTE_SECONDS, task=current.task.id)]
