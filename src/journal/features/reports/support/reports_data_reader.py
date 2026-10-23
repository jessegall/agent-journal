from datetime import datetime, timezone

from journal.features.reports.support.reports_data import ReportsData
from journal.models.agent import Agent
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages
from journal.repositories.reports import Reports


class ReportsDataReader:
    """Reads the reports feature's part of the feature data for an agent."""

    def __init__(self, reports: Reports, entries: Entries, messages: Messages) -> None:
        self.reports, self.entries, self.messages = reports, entries, messages

    def read(self, agent: Agent) -> ReportsData:
        from journal.features.reports.feature import ReportsFeature
        latest = self.reports.latest_update()
        offered_at = self.entries.last_lines(agent.session, ReportsFeature.UPDATE_SUGGESTION.key)
        update_end_at = latest[0].end_at.timestamp() if latest and latest[0].end_at else 0.0
        first = self.messages.earliest_commit(datetime.fromtimestamp(max(offered_at, update_end_at), timezone.utc))
        return ReportsData(unread_update=bool(latest) and latest[0].read_at is None, offered_at=offered_at, clock_start_at=first[0].creation_time.timestamp() if first else 0.0)
