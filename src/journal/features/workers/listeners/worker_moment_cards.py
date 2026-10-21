from journal.events.listener import Listener
from journal.events.rows.row_event import RowEvent
from journal.events.rows.worker_notified import WorkerNotified
from journal.events.rows.worker_retired import WorkerRetired
from journal.events.rows.worker_reused import WorkerReused
from journal.events.rows.worker_revived import WorkerRevived
from journal.support.actor import Actor
from journal.support.card_kind import CardKind
from journal.chat.cards import Cards
from journal.models.support.ref import Ref

MOMENTS = {
    WorkerReused: ("reused for its next job", "", "brief"),
    WorkerRevived: ("revived in its last session", "", "brief"),
    WorkerNotified: ("told a message in its session", "", "text"),
    WorkerRetired: ("retired, its report acted on", "good", ""),
}


class WorkerMomentCards(Listener[RowEvent]):
    """Each moment of a worker after its dispatch is one new mark in the chat with its own tone: reused, revived, told a message, retired."""

    def __init__(self, cards: Cards) -> None:
        self.cards = cards

    def handle(self, event: RowEvent) -> None:
        if type(event) not in MOMENTS:
            return
        text, tone, detail = MOMENTS[type(event)]
        actor = Actor.agent(event.dispatcher) if event.dispatcher else Actor.system()
        label = Cards.shortened(f"Worker {event.worker_id}, {event.name}: {text}")
        self.cards.show(event.environment_id, event.dispatcher, label, "agents", tone=tone, detail=getattr(event, detail) if detail else "", row=Ref("workers", event.worker_id), actor=actor, shows=CardKind.WORKERS)
