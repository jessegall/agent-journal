from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.performance.performance_tool import PerformanceTool
from core.base.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.developer.support.developer_settings import SLOW_TICKS_SETTING
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.settings.bindings.support.setting_values import SettingValues

SLOW_TICK_SECONDS = 0.25


class SlowTickTool(PerformanceTool):
    """Says in the chat of each environment with the option on that a tick of the journal's clock went over its
    limit, and answers whether it said so."""

    name = "developer.slow-clock-ticks"

    def __init__(self, queries: Queries, settings: SettingValues, bus: Bus) -> None:
        self.queries, self.settings, self.bus = queries, settings, bus

    def measure(self, *values: object) -> object:
        tick_seconds = float(str(values[0]))
        if tick_seconds <= SLOW_TICK_SECONDS:
            return False
        environments = {agent.environment_id for agent in MainAgentFinder.all_running(self.queries) if self.settings.flag(SLOW_TICKS_SETTING, agent.environment_id)}
        for environment_id in environments:
            self.bus.run(SendMessage(f"A tick of the journal's clock took {round(tick_seconds * 1000)} ms, over its limit of {round(SLOW_TICK_SECONDS * 1000)} ms."), Actor.core(), environment_id=environment_id)
        return bool(environments)
