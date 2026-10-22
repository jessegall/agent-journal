from journal.events.listener import Listener
from journal.events.rows.row_event import RowEvent
from journal.events.rows.task_reopened import TaskReopened
from journal.events.rows.task_started import TaskStarted
from journal.events.rows.task_wait_ended import TaskWaitEnded
from journal.features.tasks.support.waits import Waits
from journal.repositories.tasks import Tasks
from journal.support.actor import Actor


class ReleaseWaits(Listener[RowEvent]):
    """A task open again, a parked task whose wait ended or one taken up again waits on nothing: its wait links go and the checks its block or its parking made are retired."""

    def __init__(self, tasks: Tasks, waits: Waits) -> None:
        self.tasks, self.waits = tasks, waits

    def handle(self, event: RowEvent) -> None:
        if isinstance(event, (TaskReopened, TaskWaitEnded, TaskStarted)):
            self.waits.released(self.tasks.find(event.task_id), event.time, Actor.system())
