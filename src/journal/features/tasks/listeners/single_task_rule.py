from journal.events.listener import Listener
from journal.events.models.saving import Saving
from journal.models.task import Task
from journal.repositories.tasks import Tasks


class SingleTaskRule(Listener[Saving]):
    """A task is started only while no other is: whatever starts it, a start, a resume, a plan's start or its next task, a second one is refused until the first is done or parked."""

    def __init__(self, tasks: Tasks) -> None:
        self.tasks = tasks

    def handle(self, event: Saving) -> None:
        task = event.model
        if isinstance(task, Task):
            self.tasks.refuse_second(task)
