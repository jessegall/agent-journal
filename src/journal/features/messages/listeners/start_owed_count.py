from journal.events.models.updated import Updated
from journal.features.listener import Listener
from journal.models.actor import Actor
from journal.models.message import Message
from journal.repositories.agents import Agents
from journal.repositories.counts import Counts
from journal.repositories.messages import Messages


class StartOwedCount(Listener[Updated]):
    """The first message read and left unanswered starts the live agent's count of tool uses since it owes an answer; a second one owed leaves the count running."""

    def __init__(self, agents: Agents, messages: Messages, counts: Counts) -> None:
        self.agents, self.messages, self.counts = agents, messages, counts

    def handle(self, event: Updated) -> None:
        message = event.model
        just_read = isinstance(message, Message) and message.read_at is not None and event.was is not None and event.was.read_at is None
        if not just_read or len(self.messages.unanswered()) >= 2:
            return
        agent = self.agents.live()
        if agent is not None:
            self.counts.set(agent.session, "owed", 0, Actor.system())
