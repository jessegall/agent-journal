from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.link import Link
from journal.models.message import Message
from journal.models.ref import Ref
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.workers import Workers


REPORTED = "reported"
"""The kind of the link from a worker to the message that holds its report."""


class WorkerReports:
    """A worker's report, filed the one way: as a message in the chat in the worker's name, linked from the worker, and the worker marked reported."""

    def __init__(self, workers: Workers, messages: Messages, links: Links) -> None:
        self.workers, self.messages, self.links = workers, messages, links

    def file(self, worker: Worker, text: str, by: Actor, session: str = "") -> Message:
        message = self.messages.save(Message(environment_id=worker.environment_id, author=Author.AGENT, text=f"{self.lead(worker)}{text}"), by)
        self.links.save(Link(source=Ref.to(worker), target=Ref.to(message), kind=REPORTED), by)
        self.workers.save(worker.with_(session=session).reported(), by)
        return message

    def last(self, worker: Worker) -> str:
        """What the worker reported last; none while it works on a next job."""
        reports = self.links.targets(worker, REPORTED)
        if worker.state == WorkerState.DISPATCHED or not reports:
            return ""
        return self.messages.find(reports[-1].id).text.removeprefix(self.lead(worker))

    @staticmethod
    def lead(worker: Worker) -> str:
        return f"{worker.name} reports: "
