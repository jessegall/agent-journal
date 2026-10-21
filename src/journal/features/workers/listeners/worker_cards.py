from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.features.workers.support.worker_reports import WorkerReports
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.messages import Messages
from journal.support.actor import Actor
from journal.support.cards import Cards
from journal.support.card_kind import CardKind
from journal.support.ref import Ref

FAILURES = ("could not start", "failed with code", "stopped after")


class WorkerCards(Listener[ModelEvent]):
    """Each worker is one mark in the chat, keyed by its row: written when it is dispatched and settled in place when it is sent out again, reports, fails, is stopped or is retired."""

    def __init__(self, cards: Cards, messages: Messages, reports: WorkerReports) -> None:
        self.cards, self.messages, self.reports = cards, messages, reports

    def handle(self, event: ModelEvent) -> None:
        if not isinstance(event, (Created, Updated)) or not isinstance(event.model, Worker):
            return
        worker = event.model
        text, tone, detail = self.standing(worker, event)
        key = f"worker:{worker.id}"
        actor = Actor.agent(worker.dispatcher) if worker.dispatcher else Actor.system()
        card = self.messages.keyed(key, actor)
        if card and card[0].data.get("tone") == tone and card[0].data.get("detail") == detail and card[0].text.endswith(text):
            return
        self.cards.show(worker.environment_id, worker.dispatcher, f"Worker {worker.id}, {worker.name}: {text}", "agents", tone=tone, detail=detail, row=str(Ref.build(worker)), actor=actor, key=key, shows=CardKind.WORKERS)

    def standing(self, worker: Worker, event: ModelEvent) -> tuple[str, str, str]:
        if worker.state == WorkerState.STOPPED:
            return "stopped", "", ""
        if worker.state == WorkerState.REPORTED and worker.adopted:
            return "retired, its work taken in", "good", ""
        if worker.state == WorkerState.REPORTED and self.reports.last(worker).startswith(FAILURES):
            return "failed", "bad", self.reports.last(worker)
        if worker.state == WorkerState.REPORTED:
            report = self.reports.last(worker)
            return "reported", "good", report.splitlines()[0] if report else ""
        if isinstance(event, Updated) and event.previous is not None and event.previous.state == WorkerState.REPORTED:
            return "sent out again", "", worker.brief
        return f"dispatched on {worker.provider} {worker.model}".rstrip(), "", worker.brief
