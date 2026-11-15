from engine.ticker.tick_handler import TickHandler
from core.modules.plugins.ticks.delivery_pruning import DeliveryPruning
from engine.ticker.tick_interval import TickInterval


class DeliveryPruningTickHandler(TickHandler):
    """The tick handler of DeliveryPruning."""

    interval = TickInterval(seconds=24 * 60 * 60)
    handler = DeliveryPruning()
    name = "plugin delivery pruning"
    starts_immediately = True
