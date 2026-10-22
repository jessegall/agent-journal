from journal.config import Config
from journal.features.messages.support.messages_data import MessagesData
from journal.models.agent import Agent
from journal.repositories.messages import Messages
from journal.features.messages.support.peer_question import PeerQuestion
from journal.models.message import Message


class MessagesDataReader:
    """Reads the messages feature's part of the feature data for an agent."""

    def __init__(self, messages: Messages, config: Config) -> None:
        self.messages, self.config = messages, config

    def read(self, agent: Agent) -> MessagesData:
        unread, unanswered = self.messages.unread(), self.messages.unanswered()
        newest = self.messages.last_user_message() if unread else None
        read_positions = [m.read_position for m in unanswered if m.read_at]
        return MessagesData(
            unread=tuple(m.row_id for m in unread),
            unanswered=tuple(m.row_id for m in unanswered),
            unanswered_files=tuple(f"{self.config.files / 'message' / str(m.id)}/" for m in unanswered),
            inbox_tool_uses=agent.tool_uses - agent.inbox_position if newest else 0,
            uses_unanswered=agent.tool_uses - min(read_positions) if read_positions else 0,
            peer_questions=tuple(PeerQuestion(m.row_id, m.data[Message.PEER]) for m in self.messages.peer_questions()),
        )
