from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.models.worker import Worker
from journal.repositories.messages import Messages
from journal.repositories.workers import Workers


class WorkerReports:
    """A worker's report, filed the one way: as a message in the chat in the worker's name, and the worker marked reported."""

    def __init__(self, workers: Workers, messages: Messages) -> None:
        self.workers, self.messages = workers, messages

    def file(self, worker: Worker, text: str, by: Actor, session: str = "") -> Message:
        message = self.messages.save(Message(environment_id=worker.environment_id, author=Author.AGENT, text=f"{worker.name} reports: {text}"), by)
        self.workers.save(worker.with_(session=session).reported(), by)
        return message
