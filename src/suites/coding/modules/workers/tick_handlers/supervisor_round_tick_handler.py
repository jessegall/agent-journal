from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from suites.coding.modules.workers.ticks.supervisor_round import SupervisorRound


class SupervisorRoundTickHandler(TickHandler):
    """The tick handler of SupervisorRound."""

    interval = TickInterval(seconds=60)
    handler = SupervisorRound()
    name = "supervisor round"
