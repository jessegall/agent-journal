from journal.events.listener import Listener
from journal.events.rows.worker_dispatched import WorkerDispatched
from journal.features.workers.support.worker_chat import WorkerChat
from journal.repositories.workers import Workers
from journal.support.actor import Actor


class WorkerBriefRecord(Listener[WorkerDispatched]):
    """The job a worker is given, at its dispatch and at each send, is the first message of that job in its chat, from the agent that sent it."""

    def __init__(self, chat: WorkerChat, workers: Workers) -> None:
        self.chat, self.workers = chat, workers

    def handle(self, event: WorkerDispatched) -> None:
        sender = Actor.agent(event.worker.dispatcher) if event.worker.dispatcher else Actor.system()
        self.chat.instruction(self.workers.find(event.worker.id), event.brief, sender)
