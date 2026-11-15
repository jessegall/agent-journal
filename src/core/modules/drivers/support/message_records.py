from collections.abc import Sequence

from engine.database.kept_rows import KeptRows
from engine.driver.agent_message import AgentMessage
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.drivers.models.message_record import MessageRecord

AGENT_MESSAGE_LINES_REASON = "every record of the agent messages asked about decides whether each is due again"


class MessageRecords:
    """Reads the records of the lines an agent is about to be sent, never all of that agent's records."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def newest_row(self, agent_id: int, key: str) -> MessageRecord | None:
        newest = self.queries.query(MessageRecord).filter(session_agent_id=agent_id, key=key).descending("last_delivered_at")
        return self.kept.read(newest, newest.first, name="drivers.agent-messages.newest")

    def agent_message_rows(self, agent_id: int, agent_messages: Sequence[AgentMessage]) -> list[MessageRecord]:
        records = self.queries.query(MessageRecord).filter(session_agent_id=agent_id).matching(Among("key", tuple(sorted({agent_message.key for agent_message in agent_messages}))))
        return self.kept.read(records, lambda: self.loaded_rows(agent_id, agent_messages), name=f"drivers.agent-messages:{sorted({agent_message.text for agent_message in agent_messages})}")

    def loaded_rows(self, agent_id: int, agent_messages: Sequence[AgentMessage]) -> list[MessageRecord]:
        clock_keys = sorted({agent_message.key for agent_message in agent_messages if agent_message.interval})
        newest = [row for row in (self.newest_row(agent_id, key) for key in clock_keys) if row is not None]
        lines = self.queries.query(MessageRecord).filter(session_agent_id=agent_id).matching(Among("key", tuple(sorted({agent_message.key for agent_message in agent_messages})))).matching(Among("text", tuple(sorted({agent_message.text for agent_message in agent_messages})))).every_row(AGENT_MESSAGE_LINES_REASON)
        return [*newest, *lines]
