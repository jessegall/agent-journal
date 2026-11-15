from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.helpers.ticks.kept_report_retries import KeptReportRetries


class KeptReportRetriesTickHandler(TickHandler):
    """The tick handler of KeptReportRetries: each minute."""

    interval = TickInterval(seconds=60)
    handler = KeptReportRetries()
    name = "kept report retries"
