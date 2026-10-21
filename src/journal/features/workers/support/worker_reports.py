from datetime import datetime, timezone

from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.link import Link
from journal.models.message import Message
from journal.models.support.ref import Ref
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.workers import Workers


REPORTED = "reported"


class WorkerReports:
    """A worker's report, filed the one way: as a message in the chat in the worker's name, linked from the worker, and the worker marked reported."""

    def __init__(self, workers: Workers, messages: Messages, links: Links) -> None:
        self.workers, self.messages, self.links = workers, messages, links

    def file(self, worker: Worker, text: str, actor: Actor) -> Message:
        message = self.messages.save(Message(environment_id=worker.environment_id, author=Author.AGENT, text=f"{self.lead(worker)}{text}", data={"kind": Message.REPORT, "worker": worker.name, "worker_id": worker.id}), actor)
        self.links.save(Link(source=Ref.build(worker), target=Ref.build(message), kind=REPORTED), actor)
        self.workers.save(worker.reported(datetime.now(timezone.utc).timestamp(), message.id), actor)
        return message

    def last(self, worker: Worker) -> str:
        reports = self.links.targets(worker, REPORTED)
        if worker.state == WorkerState.DISPATCHED or not reports:
            return ""
        return self.messages.find(reports[-1].id).text.removeprefix(self.lead(worker))

    @staticmethod
    def lead(worker: Worker) -> str:
        return f"{worker.name} reports: "
