from engine.ticker.tick_handler import TickHandler
from core.modules.developer.ticks.request_trace_import import RequestTraceImport
from engine.ticker.tick_interval import TickInterval


class RequestTraceImportTickHandler(TickHandler):
    """The tick handler of RequestTraceImport."""

    interval = TickInterval(seconds=5)
    handler = RequestTraceImport()
    name = "request trace import"
