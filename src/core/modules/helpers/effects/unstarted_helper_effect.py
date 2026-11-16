from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.driver.interval import Interval
from engine.driver.span_queries import SpanQueries
from engine.enums.hook_event_name import HookEventName
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import RecordAgentLaunchFailure
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.helpers.support.helper_settings import UNSTARTED_HELPER_SECONDS


class UnstartedHelperEffect(EventEffect):
    """At its parent's minute step, records a failed launch for a helper the launcher took that sent no hook
    within the unstarted helper seconds of that launch. A helper whose launch still waits is never failed."""

    key = "helpers.unstarted-helper"
    events = [HookEventName.TICK]

    def __init__(self, agents: AgentRows, hook_calls: HookCallQuery, settings: SettingValues, spans: SpanQueries, clock: Clock) -> None:
        self.agents, self.hook_calls, self.settings, self.spans, self.clock = agents, hook_calls, settings, spans, clock

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        limit, now = Interval(self.settings.seconds(UNSTARTED_HELPER_SECONDS)), self.clock.timestamp()
        return [RecordAgentLaunchFailure(helper.id) for helper in self.agents.running_with_read_access(agent_id) if self.is_silent(helper, agent_id, limit, now)]

    def is_silent(self, helper: Agent, parent_id: int, limit: Interval, now: Timestamp) -> bool:
        if helper.launched_at is None:
            return False
        return limit.has_passed(self.spans, parent_id, helper.launched_at, now) and self.hook_calls.newest_agent_hook(helper.id) is None
