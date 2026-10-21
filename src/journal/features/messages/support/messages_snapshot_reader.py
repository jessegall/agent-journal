from datetime import datetime

from journal.config import Config
from journal.features.messages.support.messages_snapshot import MessagesSnapshot
from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages

LOOKED_BACK = 400


class MessagesSnapshotReader:
    """Reads the messages feature's part of the Snapshot for an agent."""

    def __init__(self, messages: Messages, entries: Entries, config: Config) -> None:
        self.messages, self.entries, self.config = messages, entries, config

    def read(self, agent: Agent) -> MessagesSnapshot:
        from journal.features.messages.feature import Messages as MessagesFeature
        unread, unanswered = self.messages.unread(), self.messages.unanswered()
        own = [e for e in self.entries.tool_starts(agent.session, LOOKED_BACK) if not (e.data.get("agent_id") or e.data.get("subagent_id"))]
        newest = self.messages.last_sent_by_user() if unread else None
        read_at = min((m.read_at for m in unanswered if m.read_at), default=None)
        return MessagesSnapshot(
            unread=tuple(m.id for m in unread),
            unanswered=tuple(m.id for m in unanswered),
            unanswered_files=tuple(f"{self.config.files / 'message' / str(m.id)}/" for m in unanswered),
            uses_since_newest=self.uses_after(own, newest.created_at) if newest else 0,
            times_named=self.entries.said_count_after(agent.session, tuple(n.key for n in MessagesFeature.INBOX_LINES), newest.created_at.timestamp()) if newest else 0,
            uses_unanswered=self.uses_after(own, read_at) if read_at else 0,
        )

    @staticmethod
    def uses_after(own: list[Entry], at: datetime) -> int:
        return sum(1 for e in own if e.created_at > at)
