from engine.ticker.tick_handler import TickHandler
from core.modules.processes.ticks.run_end_recovery import RunEndRecovery
from engine.ticker.tick_interval import TickInterval


class RunEndRecoveryTickHandler(TickHandler):
    """The tick handler of RunEndRecovery."""

    interval = TickInterval(seconds=15)
    handler = RunEndRecovery()
    name = "run end recovery"
    starts_immediately = True
