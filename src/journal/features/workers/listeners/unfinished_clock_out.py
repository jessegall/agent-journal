from journal.events.listener import Listener
from journal.events.rows.worker_unfinished import WorkerUnfinished
from journal.features.workers.support.worker_actions import WorkerActions
from journal.features.workers.support.worker_resumes import WorkerResumes
from journal.repositories.workers import Workers
from journal.support.actor import Actor

CLOCK_OUT_REQUEST = "Your run ended before you clocked out. Clock out now with journal clock-out \"<what you did, file by file, and what you could not do>\"."


class UnfinishedClockOut(Listener[WorkerUnfinished]):
    """A worker whose run ended without its clocking out is asked by the journal itself to clock out, in its last session, the first time; the orchestrator is told only when it ends so a second time, or at once when there is no session or conversation to ask in, or when its agent never started its session twice, since it has nothing to clock out of."""

    def __init__(self, actions: WorkerActions, workers: Workers, resumes: WorkerResumes) -> None:
        self.actions, self.workers, self.resumes = actions, workers, resumes

    def handle(self, event: WorkerUnfinished) -> None:
        if event.times == 1 and not event.is_stalled_start and self.resumes.is_resumable(self.workers.find(event.worker.id)):
            self.actions.send(event.worker.id, CLOCK_OUT_REQUEST, None, Actor.system())
