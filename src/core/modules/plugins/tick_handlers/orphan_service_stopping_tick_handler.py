from engine.ticker.tick_handler import TickHandler
from core.modules.plugins.ticks.orphan_service_stopping import OrphanServiceStopping
from engine.ticker.tick_interval import TickInterval


class OrphanServiceStoppingTickHandler(TickHandler):
    """The tick handler of OrphanServiceStopping."""

    interval = TickInterval(seconds=60)
    handler = OrphanServiceStopping()
    name = "orphan plugin service stopping"
