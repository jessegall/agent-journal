from core.base.actor import Actor
from core.modules.agents.models.agent import Agent
from core.base.command.bus import Bus
from core.base.performance.performance_tool import PerformanceTool
from core.base.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.developer.support.developer_settings import SLOW_TICKS_SETTING
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.settings.bindings.support.setting_values import SettingValues

TICK_LIMIT_POINTS = 50


class SlowTickTool(PerformanceTool):
    """Says in the chat of each environment with the option on that a tick of the journal's clock went over its
    limit, and answers whether it said so."""

    name = "developer.slow-clock-ticks"

    def __init__(self, queries: Queries, settings: SettingValues, bus: Bus) -> None:
        self.queries, self.settings, self.bus = queries, settings, bus

    def measure(self, *values: object) -> object:
        points = int(str(values[0]))
        if points <= TICK_LIMIT_POINTS:
            return False
        environments = {agent.environment_id for agent in MainAgentFinder.all_running(self.queries) if self.reports_slow_ticks(agent)}
        for environment_id in environments:
            self.bus.run(SendMessage(f"A tick of the journal's clock cost {points} points, over its limit of {TICK_LIMIT_POINTS} points."), Actor.core(), environment_id=environment_id)
        return bool(environments)

    def reports_slow_ticks(self, agent: Agent) -> bool:
        with self.bus.scopes.read_scope((), None, agent.environment_id):
            return self.settings.flag(SLOW_TICKS_SETTING)
