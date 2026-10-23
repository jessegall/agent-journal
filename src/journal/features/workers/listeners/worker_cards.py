from journal.chat.moment_cards import MomentCards
from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.features.workers.support.worker_process_card import FAILED, WorkerProcessCard
from journal.models.support.ref import Ref
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.support.actor import Actor
from journal.support.card_kind import CardKind


class WorkerCards(Listener[ModelEvent]):
    """A worker's dispatch is one process card in the chat, which changes only when the dispatch itself failed, red with why; every later standing it reaches, finished and ready to check, stopped before it finished, reported, stopped, merged or released, is a moment card at the bottom of the chat, one per move, and its clock-in none, since its dispatch or its next job already says it started; its other moments are marks of their own, WorkerMomentCards."""

    def __init__(self, card: WorkerProcessCard, cards: MomentCards) -> None:
        self.card, self.cards = card, cards

    def handle(self, event: ModelEvent) -> None:
        if not isinstance(event, (Created, Updated)) or not isinstance(event.model, Worker):
            return
        worker = event.model
        standing = self.card.standing(worker)
        if worker.state == WorkerState.READY or (worker.state == WorkerState.DISPATCHED and worker.reuse_count):
            return
        actor = Actor.agent(worker.dispatcher) if worker.dispatcher else Actor.system()
        if worker.state == WorkerState.DISPATCHED or standing.text == FAILED:
            self.card.show(worker, standing, actor)
            return
        key = f"worker:{worker.id}:{worker.state}:{worker.silence.timeout.start}"
        if not self.cards.is_shown(key, actor):
            self.cards.show(worker.environment_id, worker.dispatcher, f"Worker {worker.id}, {worker.name}: {standing.text}", "agents", tone=standing.tone, detail=standing.detail, row=Ref.build(worker), actor=actor, key=key, shows=CardKind.WORKERS)
