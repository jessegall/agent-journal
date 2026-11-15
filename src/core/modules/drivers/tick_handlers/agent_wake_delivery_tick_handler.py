from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.drivers.ticks.agent_wake_delivery import AgentWakeDelivery


class AgentWakeDeliveryTickHandler(TickHandler):
    """The tick handler of AgentWakeDelivery: a round every few seconds, and one at boot."""

    interval = TickInterval(seconds=5)
    handler = AgentWakeDelivery()
    name = "agent wake delivery"
    starts_immediately = True
