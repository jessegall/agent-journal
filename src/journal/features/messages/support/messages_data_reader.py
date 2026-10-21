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
        newest = self.messages.last_user_message() if unread else None
        read_positions = [m.read_position for m in unanswered if m.read_at]
        return MessagesData(
            unread=tuple(m.id for m in unread),
            unanswered=tuple(m.id for m in unanswered),
            unanswered_files=tuple(f"{self.config.files / 'message' / str(m.id)}/" for m in unanswered),
            newest_gap=agent.tool_uses - agent.inbox_position if newest else 0,
            mention_count=self.entries.nudge_count(agent.session, tuple(n.key for n in MessagesFeature.INBOX_LINES), agent.inbox_position) if newest else 0,
            uses_unanswered=agent.tool_uses - min(read_positions) if read_positions else 0,
        )

