from journal.support.card_outcome import CardOutcome
from journal.chat.process_card import ProcessCard
from journal.chat.process_card_contents import ProcessCardContents
from journal.chat.card_detail import CardDetail
from journal.features.workers.support.card_standing import CardStanding
from journal.features.workers.support.worker_reports import WorkerReports
from journal.models.message import Message
from journal.models.support.ref import Ref
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.messages import Messages
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.card_type import CardType

FAILURES = ("could not start", "failed with code", "stopped after")
STATE_OUTCOMES = {WorkerState.STOPPED: CardOutcome.NONE, WorkerState.READY: CardOutcome.RUNNING, WorkerState.CLOCKING_OUT: CardOutcome.RUNNING, WorkerState.MERGED: CardOutcome.PASSED, WorkerState.RELEASED: CardOutcome.NONE}
STATE_NAMES = {WorkerState.STOPPED: "stopped", WorkerState.READY: "started", WorkerState.CLOCKING_OUT: "clocking out", WorkerState.MERGED: "merged", WorkerState.RELEASED: "released", WorkerState.UNFINISHED: "stopped before it finished", WorkerState.DELIVERED: "finished, ready to check"}
FAILED = "failed"


class WorkerProcessCard(ProcessCard):
    """The process card of a worker's dispatch, active while the worker starts and turned red with why when the dispatch failed, naming the task it was given; each standing the worker reaches is informed in words its card and its later cards share."""

    name = "worker"

    def __init__(self, workers: Workers, reports: WorkerReports, messages: Messages, tasks: Tasks) -> None:
        self.workers, self.reports, self.messages, self.tasks = workers, reports, messages, tasks

    @staticmethod
    def key(worker: Worker) -> str:
        return f"worker:{worker.id}"

    def card_contents(self, worker: Worker, standing: CardStanding, actor: Actor) -> ProcessCardContents | None:
        older = self.messages.keyed(self.key(worker), actor)
        if older and older[0].data.get("outcome") == str(standing.outcome) and older[0].data.get("detail") == standing.detail and older[0].text.endswith(standing.text):
            return None
        data = {"kind": "card", "outcome": str(standing.outcome), "row": str(Ref.build(worker)), "task": self.tasks.last_task_id(Ref.build(worker)), **self.stop_reason(worker)}
        return ProcessCardContents(self.name, worker.environment_id, self.key(worker), self.label(worker, standing.text), data, actor, CardType.WORKERS, worker.is_dispatched(), standing.detail, worker.dispatcher)

    @staticmethod
    def label(worker: Worker, text: str) -> str:
        return f"{worker.name}: {text}"

    def refresh(self, message: Message) -> dict:
        worker = self.workers.find(Ref.parse(message.data["row"]).id)
        standing = self.standing(worker)
        return {"outcome": str(standing.outcome), **CardDetail.parts(standing.detail), **self.stop_reason(worker), "active": worker.is_dispatched()}

    @staticmethod
    def stop_reason(worker: Worker) -> dict:
        return {"reason": worker.run_end} if worker.is_unfinished() and worker.run_end else {}

    def standing(self, worker: Worker) -> CardStanding:
        if worker.state in STATE_OUTCOMES:
            return CardStanding(STATE_NAMES[worker.state], STATE_OUTCOMES[worker.state])
        if worker.is_unfinished():
            return CardStanding(STATE_NAMES[worker.state], CardOutcome.FAILED, worker.run_end)
        if worker.is_delivered():
            return CardStanding(STATE_NAMES[worker.state], CardOutcome.PASSED, self.first_line(worker))
        if worker.state == WorkerState.REPORTED and self.reports.last(worker).startswith(FAILURES):
            return CardStanding(FAILED, CardOutcome.FAILED, self.reports.last(worker))
        if worker.state == WorkerState.REPORTED:
            return CardStanding("reported", CardOutcome.PASSED, self.first_line(worker))
        return CardStanding(f"started on {worker.provider} {worker.model}".rstrip(), CardOutcome.RUNNING, worker.brief)

    def first_line(self, worker: Worker) -> str:
        report = self.reports.last(worker)
        return report.splitlines()[0] if report else ""
