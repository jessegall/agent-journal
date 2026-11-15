from engine.ticker.tick_handler import TickHandler
from core.modules.drivers.ticks.interrupted_agent_wake import InterruptedAgentWake
from engine.ticker.tick_interval import TickInterval


class InterruptedAgentWakeTickHandler(TickHandler):
    """The tick handler of InterruptedAgentWake."""

    interval = TickInterval(seconds=3)
    handler = InterruptedAgentWake()
    name = "interrupted agents"
