from engine.ticker.tick_handler import TickHandler
from core.modules.documents.ticks.close_ended_documents_tick import CloseEndedDocumentsTick
from engine.ticker.tick_interval import TickInterval


class CloseEndedDocumentsTickHandler(TickHandler):
    """The tick handler of CloseEndedDocumentsTick."""

    interval = TickInterval(seconds=5)
    handler = CloseEndedDocumentsTick()
    name = "close ended documents"
    starts_immediately = True
