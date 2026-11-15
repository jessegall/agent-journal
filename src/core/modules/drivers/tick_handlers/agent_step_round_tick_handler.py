from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.drivers.ticks.agent_step_round import AgentStepRound


class AgentStepRoundTickHandler(TickHandler):
    """The tick handler of AgentStepRound: a round every few seconds, and one at boot."""

    interval = TickInterval(seconds=5)
    handler = AgentStepRound()
    name = "agent step round"
    starts_immediately = True
