from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.agents.ticks.agent_renumber_finish import AgentRenumberFinish


class AgentRenumberFinishTickHandler(TickHandler):
    """The tick handler of AgentRenumberFinish."""

    interval = TickInterval(seconds=60)
    handler = AgentRenumberFinish()
    name = "renumber of agents, the folders and the notices"
    starts_immediately = True
