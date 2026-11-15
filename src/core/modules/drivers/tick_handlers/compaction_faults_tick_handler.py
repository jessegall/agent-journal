from engine.ticker.tick_handler import TickHandler
from core.modules.drivers.ticks.compaction_faults_tick import CompactionFaultsTick
from engine.ticker.tick_interval import TickInterval


class CompactionFaultsTickHandler(TickHandler):
    """The tick handler of CompactionFaultsTick."""

    interval = TickInterval(seconds=60)
    handler = CompactionFaultsTick()
    name = "compaction faults"
