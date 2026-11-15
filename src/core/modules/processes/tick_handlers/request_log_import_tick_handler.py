from engine.ticker.tick_handler import TickHandler
from core.modules.processes.ticks.request_log_import import RequestLogImport
from engine.ticker.tick_interval import TickInterval


class RequestLogImportTickHandler(TickHandler):
    """The tick handler of RequestLogImport."""

    interval = TickInterval(seconds=5)
    handler = RequestLogImport()
    name = "request log import"
