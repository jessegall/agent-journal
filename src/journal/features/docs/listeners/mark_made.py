from journal.engine.cards import Cards
from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.models.actor_kind import ActorKind
from journal.models.doc import Doc
from journal.repositories.agents import Agents


class MarkMade(Listener[Created]):
    """A document an agent writes is a mark in its environment's chat."""

    def __init__(self, agents: Agents, cards: Cards) -> None:
        self.agents, self.cards = agents, cards

    def handle(self, event: Created) -> None:
        doc = event.model
        if not isinstance(doc, Doc) or event.by.kind != ActorKind.AGENT:
            return
        agent = self.agents.for_session(event.by.id)
        data = {"kind": "made", "session": event.by.id, "made_type": "docs", "n": doc.id, "abstract": doc.abstract, "row": f"docs:{doc.id}", "shows": "made"}
        self.cards.keyed(agent.environment_id, f"made:doc:{doc.id}", doc.title, data, event.by)
