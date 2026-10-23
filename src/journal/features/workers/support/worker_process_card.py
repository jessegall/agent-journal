from journal.chat.process_card import ProcessCard
from journal.chat.process_cards import ProcessCards
from journal.chat.card_detail import CardDetail
from journal.features.workers.support.card_standing import CardStanding
from journal.features.workers.support.worker_reports import WorkerReports
from journal.models.message import Message
from journal.models.support.ref import Ref
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.messages import Messages
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.card_kind import CardKind

FAILURES = ("could not start", "failed with code", "stopped after")
STATE_TONES = {WorkerState.STOPPED: "", WorkerState.READY: "", WorkerState.MERGED: "good", WorkerState.RELEASED: ""}
FAILED = "failed"


class WorkerProcessCard(ProcessCard):
    """The process card of a worker's dispatch, active while the worker starts and turned red with why when the dispatch failed; each standing the worker reaches is told in words its card and its later cards share."""

    name = "worker"

    def __init__(self, workers: Workers, reports: WorkerReports, cards: ProcessCards, messages: Messages) -> None:
        self.workers, self.reports, self.cards, self.messages = workers, reports, cards, messages

    @staticmethod
    def key(worker: Worker) -> str:
        return f"worker:{worker.id}"

    def show(self, worker: Worker, standing: CardStanding, actor: Actor) -> None:
        older = self.messages.keyed(self.key(worker), actor)
        if older and older[0].data.get("tone") == standing.tone and older[0].data.get("detail") == standing.detail and older[0].text.endswith(standing.text):
            return
        data = {"kind": "card", "icon": "agents", "tone": standing.tone, "row": str(Ref.build(worker))}
        self.cards.show(self.name, worker.environment_id, self.key(worker), f"Worker {worker.id}, {worker.name}: {standing.text}", data, actor, CardKind.WORKERS, worker.state == WorkerState.DISPATCHED, standing.detail, worker.dispatcher)

    def refresh(self, message: Message) -> dict:
        worker = self.workers.find(Ref.parse(message.data["row"]).id)
        standing = self.standing(worker)
        return {"tone": standing.tone, **CardDetail.parts(standing.detail), "active": worker.state == WorkerState.DISPATCHED}

    def standing(self, worker: Worker) -> CardStanding:
        if worker.state in STATE_TONES:
            return CardStanding(worker.state, STATE_TONES[worker.state])
        if worker.state == WorkerState.UNFINISHED:
            return CardStanding(worker.state, "bad", worker.run_end)
        if worker.state == WorkerState.DELIVERED:
            return CardStanding(worker.state, "good", self.first_line(worker))
        if worker.state == WorkerState.REPORTED and self.reports.last(worker).startswith(FAILURES):
            return CardStanding(FAILED, "bad", self.reports.last(worker))
        if worker.state == WorkerState.REPORTED:
            return CardStanding("reported", "good", self.first_line(worker))
        return CardStanding(f"dispatched on {worker.provider} {worker.model}".rstrip(), "", worker.brief)

    def first_line(self, worker: Worker) -> str:
        report = self.reports.last(worker)
        return report.splitlines()[0] if report else ""
