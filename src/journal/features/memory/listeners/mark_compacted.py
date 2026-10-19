from journal.support.cards import Cards
from journal.events.agent.compacting import Compacting
from journal.events.agent_listener import AgentListener


class MarkCompacted(AgentListener[Compacting]):
    """A compaction of the agent's window is a mark in the chat."""

    def __init__(self, cards: Cards) -> None:
        self.cards = cards

    def handle(self, event: Compacting) -> None:
        self.cards.show(event.environment_id, event.session, "Conversation compacted", "activity", "warn", kind="compacted")
