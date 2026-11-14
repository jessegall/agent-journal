from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.documents.models.report import Report
from engine.event.changed import Changed


class ReportMentionListener(TextMentionListener[Changed[Report]]):
    """Links a saved report to the rows it names."""

    name = "documents.report-mentions"
