from journal.events.listener import Listener
from journal.events.rows.worker_review_requested import WorkerReviewRequested
from journal.features.workers.support.queue_handoff import QueueHandoff
from journal.features.workers.workers_options import WorkersOptions
from journal.models.support.ref import Ref
from journal.models.task_state import TaskState
from journal.repositories.setting_rows import SettingRows
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.support.actor import Actor


class QueueHandoffAtReview(Listener[WorkerReviewRequested]):
    """With the next task at clock-out on, a worker whose clock-out goes to the reviewer while an unblocked task waits first in its queue has its queue taken over at once by a fresh worker, instead of waiting for the merge."""

    def __init__(self, settings: SettingRows, workers: Workers, tasks: Tasks, handoff: QueueHandoff) -> None:
        self.settings, self.workers, self.tasks, self.handoff = settings, workers, tasks, handoff

    def handle(self, event: WorkerReviewRequested) -> None:
        if not self.settings.option(WorkersOptions.NEXT_AT_CLOCK_OUT):
            return
        worker = self.workers.find(event.worker.id)
        waiting = self.tasks.queue(Ref.build(worker))
        if waiting and waiting[0].state != TaskState.BLOCKED:
            self.handoff.handed_off(worker, waiting, Actor.system())
