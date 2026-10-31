from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.documents.models.report import Report


class ReportMentionListener(TextMentionListener):
    """Links a saved report to the rows it names."""

    name = "documents.report-mentions"
    event = "report.*"
    model = Report
