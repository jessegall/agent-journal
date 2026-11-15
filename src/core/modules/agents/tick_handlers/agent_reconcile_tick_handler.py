from engine.ticker.tick_handler import TickHandler
from core.modules.agents.ticks.agent_reconcile import AgentReconcile
from engine.ticker.tick_interval import TickInterval


class AgentReconcileTickHandler(TickHandler):
    """The tick handler of AgentReconcile."""

    interval = TickInterval(seconds=30)
    handler = AgentReconcile()
    name = "agent rows and their programs"
