from engine.ticker.tick_handler import TickHandler
from core.modules.processes.ticks.run_slot_grant import RUN_SLOT_GRANT_SECONDS
from core.modules.processes.ticks.run_slot_grant import RunSlotGrant
from engine.ticker.tick_interval import TickInterval


class RunSlotGrantTickHandler(TickHandler):
    """The tick handler of RunSlotGrant."""

    interval = TickInterval(seconds=RUN_SLOT_GRANT_SECONDS)
    handler = RunSlotGrant()
    name = "run slots"
