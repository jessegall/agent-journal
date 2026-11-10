from core.modules.agents.models.agent import Agent
from core.base.command.bus import Bus
from engine.log.exception_sink import CLOCK_TICK_SOURCE, ExceptionSink
from engine.performance.performance_tool import PerformanceTool
from engine.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.developer.support.developer_settings import SLOW_TICKS_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues

TICK_LIMIT_POINTS = 50


class SlowTickTool(PerformanceTool):
    """Shows a warning mark in the chat of each environment with the option on when a tick of the journal's
    clock goes over its limit, as an exception does, so it reaches the main agent as a line while that option
    is on, and answers whether it did."""

    name = "developer.slow-clock-ticks"

    def __init__(self, queries: Queries, settings: SettingValues, bus: Bus, sink: ExceptionSink) -> None:
        self.queries, self.settings, self.bus, self.sink = queries, settings, bus, sink

    def measure(self, *values: object) -> object:
        points = int(str(values[0]))
        spent = str(values[1]) if len(values) > 1 else ""
        if points <= TICK_LIMIT_POINTS:
            return False
        environments = {agent.environment_id for agent in MainAgentFinder.all_running(self.queries) if self.reports_slow_ticks(agent)}
        for environment_id in environments:
            self.sink.record(CLOCK_TICK_SOURCE, f"A tick of the journal's clock cost {points} points, over its limit of {TICK_LIMIT_POINTS} points: {spent}.", environment_id)
        return bool(environments)

    def reports_slow_ticks(self, agent: Agent) -> bool:
        with self.bus.scopes.read_scope((), None, agent.environment_id):
            return self.settings.flag(SLOW_TICKS_SETTING)
