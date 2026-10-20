from journal.features.messages.support.messages_standing import MessagesStanding
from journal.models.agent import Agent
from journal.repositories.messages import Messages


class MessagesStandingReader:
    """Reads the messages feature's part of the Standing for an agent."""

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def read(self, agent: Agent) -> MessagesStanding:
        return MessagesStanding(unread=tuple(m.id for m in self.messages.unread()), unanswered=tuple(m.id for m in self.messages.unanswered()))
