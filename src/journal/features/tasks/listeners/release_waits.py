from journal.events.listener import Listener
from journal.events.rows.task_reopened import TaskReopened
from journal.features.tasks.support.waits import Waits
from journal.repositories.tasks import Tasks
from journal.support.actor import Actor


class ReleaseWaits(Listener[TaskReopened]):
    """A task open again, whatever opened it, waits on nothing: its wait links go and the checks its block made are retired."""

    def __init__(self, tasks: Tasks, waits: Waits) -> None:
        self.tasks, self.waits = tasks, waits

    def handle(self, event: TaskReopened) -> None:
        self.waits.released(self.tasks.find(event.task_id), event.time, Actor.system())
