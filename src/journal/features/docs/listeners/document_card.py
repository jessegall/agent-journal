from journal.chat.row_process_card import RowProcessCard
from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.support.actor_kind import ActorKind
from journal.models.doc import Doc
from journal.repositories.agents import Agents


class DocumentCard(Listener[Created]):
    """A document an agent writes is a mark in its environment's chat."""

    def __init__(self, agents: Agents, card: RowProcessCard) -> None:
        self.agents, self.card = agents, card

    def handle(self, event: Created) -> None:
        doc = event.model
        if not isinstance(doc, Doc) or event.actor.kind != ActorKind.AGENT:
            return
        self.card.show(self.agents.session_agent(event.actor.id).environment_id, doc, event.actor)
