from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.features.workers.support.card_standing import CardStanding
from journal.features.workers.support.worker_reports import WorkerReports
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.messages import Messages
from journal.support.actor import Actor
from journal.chat.cards import Cards
from journal.support.card_kind import CardKind
from journal.models.support.ref import Ref

FAILURES = ("could not start", "failed with code", "stopped after")
STATE_TONES = {WorkerState.STOPPED: "", WorkerState.READY: "", WorkerState.MERGED: "good", WorkerState.RELEASED: ""}


class WorkerCards(Listener[ModelEvent]):
    """Each worker is one mark in the chat, keyed by its row, that shows where it stands: written when it is dispatched and settled in place when it clocks in, clocks out, ends unfinished, reports, fails, is stopped, merged or released; its later moments are marks of their own, WorkerMomentCards."""

    def __init__(self, cards: Cards, messages: Messages, reports: WorkerReports) -> None:
        self.cards, self.messages, self.reports = cards, messages, reports

    def handle(self, event: ModelEvent) -> None:
        if not isinstance(event, (Created, Updated)) or not isinstance(event.model, Worker):
            return
        worker = event.model
        standing = self.standing(worker)
        key = f"worker:{worker.id}"
        actor = Actor.agent(worker.dispatcher) if worker.dispatcher else Actor.system()
        card = self.messages.keyed(key, actor)
        if card and card[0].data.get("tone") == standing.tone and card[0].data.get("detail") == standing.detail and card[0].text.endswith(standing.text):
            return
        self.cards.show(worker.environment_id, worker.dispatcher, f"Worker {worker.id}, {worker.name}: {standing.text}", "agents", tone=standing.tone, detail=standing.detail, row=Ref.build(worker), actor=actor, key=key, shows=CardKind.WORKERS)

    def standing(self, worker: Worker) -> CardStanding:
        if worker.state in STATE_TONES:
            return CardStanding(worker.state, STATE_TONES[worker.state])
        if worker.state == WorkerState.UNFINISHED:
            return CardStanding(worker.state, "bad", worker.run_end)
        if worker.state == WorkerState.DELIVERED:
            return CardStanding(worker.state, "good", self.first_line(worker))
        if worker.state == WorkerState.REPORTED and self.reports.last(worker).startswith(FAILURES):
            return CardStanding("failed", "bad", self.reports.last(worker))
        if worker.state == WorkerState.REPORTED:
            return CardStanding("reported", "good", self.first_line(worker))
        return CardStanding(f"dispatched on {worker.provider} {worker.model}".rstrip(), "", worker.brief)

    def first_line(self, worker: Worker) -> str:
        report = self.reports.last(worker)
        return report.splitlines()[0] if report else ""
