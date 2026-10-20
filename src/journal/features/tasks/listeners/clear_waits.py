from journal.support.telling import Telling
from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.support.actor import Actor
from journal.support.awaitables import Awaitables
from journal.support.ref import Ref
from journal.models.task import Task
from journal.repositories.tasks import Tasks


class ClearWaits(Listener[Updated]):
    """A question answered, a task closed or a check waited until passing unblocks the tasks that wait on it by a link, once nothing else holds them, and the live agent is told."""

    def __init__(self, tasks: Tasks, telling: Telling) -> None:
        self.tasks, self.telling = tasks, telling

    def handle(self, event: Updated) -> None:
        if not Awaitables.just_settled(event):
            return
        for task in self.tasks.waiting_on(event.model):
            if not self.tasks.open_waits(task):
                self.cleared(self.tasks.save(task.unblocked(), Actor.system()), Ref.to(event.model))

    def cleared(self, task: Task, ref: Ref) -> None:
        from journal.features.tasks.feature import Tasks as TasksFeature
        self.telling.tell(TasksFeature.WAIT_CLEARED.about(n=task.id, on=f"{ref.type[:-1]} {ref.id}"))
