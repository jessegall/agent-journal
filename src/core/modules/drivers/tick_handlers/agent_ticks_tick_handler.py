from engine.ticker.tick_handler import TickHandler
from core.modules.drivers.ticks.agent_ticks import AgentTicks
from engine.ticker.tick_interval import TickInterval


class AgentTicksTickHandler(TickHandler):
    """The tick handler of AgentTicks."""

    interval = TickInterval(seconds=60)
    handler = AgentTicks()
    name = "agent ticks"
    starts_immediately = True
