from journal.config import Config
from journal.features.messages.support.messages_data import MessagesData
from journal.models.agent import Agent
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages



class MessagesDataReader:
    """Reads the messages feature's part of the feature data for an agent."""

    def __init__(self, messages: Messages, entries: Entries, config: Config) -> None:
        self.messages, self.entries, self.config = messages, entries, config

    def read(self, agent: Agent) -> MessagesData:
        from journal.features.messages.feature import Messages as MessagesFeature
        unread, unanswered = self.messages.unread(), self.messages.unanswered()
        newest = self.messages.last_sent_by_user() if unread else None
        read_marks = [m.read_mark for m in unanswered if m.read_at]
        return MessagesData(
            unread=tuple(m.id for m in unread),
            unanswered=tuple(m.id for m in unanswered),
            unanswered_files=tuple(f"{self.config.files / 'message' / str(m.id)}/" for m in unanswered),
            uses_since_newest=agent.tool_uses - agent.inbox_mark if newest else 0,
            times_named=self.entries.nudge_count(agent.session, tuple(n.key for n in MessagesFeature.INBOX_LINES), agent.inbox_mark) if newest else 0,
            uses_unanswered=agent.tool_uses - min(read_marks) if read_marks else 0,
        )

