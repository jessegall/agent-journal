from journal.events.listener import Listener
from journal.events.rows.worker_notified import WorkerNotified
from journal.features.workers.support.worker_chat import WorkerChat
from journal.repositories.workers import Workers
from journal.support.actor import Actor


class WorkerNoteRecord(Listener[WorkerNotified]):
    """A note given to a running worker is a message in its chat, written once where it is sent, never again from its transcript."""

    def __init__(self, chat: WorkerChat, workers: Workers) -> None:
        self.chat, self.workers = chat, workers

    def handle(self, event: WorkerNotified) -> None:
        sender = Actor.agent(event.worker.dispatcher) if event.worker.dispatcher else Actor.system()
        self.chat.instruction(self.workers.find(event.worker.id), event.text, sender)
