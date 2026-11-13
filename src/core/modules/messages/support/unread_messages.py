from engine.enums.agent_role import AgentRole
from engine.database.kept_rows import KeptRows
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.query.query import Query
from engine.query.rows.kept_row_changes import KeptRowChanges
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message

UNREAD_PEOPLE_REASON = "every unread message of a user is shared out to the agents it addresses"


class UnreadMessages(KeptRowChanges[Message]):
    """Shares unread user messages in each environment and selects their recipients."""

    def __init__(self, queries: Queries, kept: KeptRows, agents: AgentRows) -> None:
        self.queries, self.kept, self.agents = queries, kept, agents

    def addressed(self, agent_id: int) -> tuple[Message, ...]:
        unread = self.unread_person_messages()
        messages = self.kept.read(unread, lambda: tuple(unread.every_row(UNREAD_PEOPLE_REASON)), name="messages.unread_person_messages")
        agent = self.agents.find(agent_id)
        return tuple(message for message in messages if message.target_agent_id == agent_id
                     or (message.target_agent_id is None and agent.role == AgentRole.MAIN))

    def kept_rows(self, message: Message) -> tuple[Message, ...]:
        return tuple([message]) if message.read_at is None and message.type in PERSON_MESSAGE_TYPES else ()

    def update_kept(self, message: Message, pending: tuple[Message, ...]) -> None:
        def replaced(messages: tuple[Message, ...]) -> tuple[Message, ...]:
            return tuple(sorted([row for row in messages if row.id != message.id] + list(pending), key=lambda row: row.id))

        self.kept.update(self.unread_person_messages(), replaced, name="messages.unread_person_messages")

    def unread_person_messages(self) -> Query[Message]:
        return self.queries.query(Message).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at")).oldest()
