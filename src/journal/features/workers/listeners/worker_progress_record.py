from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.models.proof import Proof
from journal.models.task_log import TaskLog
from journal.models.worker_todo import WorkerTodo
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.time_source import TimeSource

PROGRESS_ROWS = (Proof, TaskLog, WorkerTodo)
from journal.support.worker_actor import WorkerActor

class WorkerProgressRecord(Listener[Created]):
    """A proof, a to-do or a log line a worker writes is progress, so its quiet span starts again from that moment."""

    actors = (WorkerActor,)

    def __init__(self, workers: Workers, time_source: TimeSource) -> None:
        self.workers, self.time_source = workers, time_source

    def handle(self, event: Created) -> None:
        if not isinstance(event.model, PROGRESS_ROWS):
            return
        for worker in self.workers.numbered(event.actor.number()):
            self.workers.save(worker.contacted(self.time_source.seconds()), Actor.system())
