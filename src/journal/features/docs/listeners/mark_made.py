from journal.support.cards import Cards
from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.support.actor_kind import ActorKind
from journal.models.doc import Doc
from journal.repositories.agents import Agents


class MarkMade(Listener[Created]):
    """A document an agent writes is a mark in its environment's chat."""

    def __init__(self, agents: Agents, cards: Cards) -> None:
        self.agents, self.cards = agents, cards

    def handle(self, event: Created) -> None:
        doc = event.model
        if not isinstance(doc, Doc) or event.actor.kind != ActorKind.AGENT:
            return
        self.cards.made_mark(self.agents.for_session(event.actor.id).environment_id, doc, event.actor)
