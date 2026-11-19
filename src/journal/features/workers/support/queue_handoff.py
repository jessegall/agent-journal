from journal.features.workers.support.worker_dispatch import WorkerDispatch
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.models.worker import Worker
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.rejection import Rejection


class QueueHandoff:
    """Tasks for a worker whose work waits for the reviewer, taken over at once by a fresh worker the journal sends shaped as it, in a worktree of its own cut from the project's branch, never from the unmerged work: the first handed to it and the rest queued behind; the clocked-out worker is left to its review and any send-back, and a send that is refused puts the tasks back in its queue."""

    def __init__(self, tasks: Tasks, workers: Workers, sending: WorkerDispatch) -> None:
        self.tasks, self.workers, self.sending = tasks, workers, sending

    def handed_off(self, worker: Worker, waiting: list[Task], actor: Actor) -> Worker:
        for task in waiting:
            self.tasks.unqueued_task(task, actor)
        first = self.tasks.find(waiting[0].row_id)
        try:
            fresh = self.sending.sent(self.workers.save(self.sending.shaped(worker, first, worker.dispatcher), actor), first, actor, Worker.auto_dispatched)
        except Rejection:
            for task in waiting:
                self.tasks.queued(self.tasks.find(task.row_id), Ref.build(worker), actor)
            raise
        for task in waiting[1:]:
            self.tasks.queued(self.tasks.find(task.row_id), Ref.build(fresh), actor)
        return fresh
