from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.drivers.ticks.agent_minute_steps import AgentMinuteSteps


class AgentMinuteStepsTickHandler(TickHandler):
    """The tick handler of AgentMinuteSteps: each minute, and once at boot."""

    interval = TickInterval(seconds=60)
    handler = AgentMinuteSteps()
    name = "agent minute steps"
    starts_immediately = True
