from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.models.link import Link
from journal.models.proof import Proof
from journal.models.worker_todo import WorkerTodo
from journal.repositories.links import Links
from journal.repositories.proofs import PROOF_LINK
from journal.repositories.tasks import Tasks
from journal.repositories.worker_todos import TODO_LINK

KINDS = (PROOF_LINK, TODO_LINK)


class TaskTouch(Listener[ModelEvent]):
    """A proof or a to-do item linked to a task, or changed, moves the task's updated_at, so the viewer's panel of the task shows it on its next look."""

    def __init__(self, tasks: Tasks, links: Links) -> None:
        self.tasks, self.links = tasks, links

    def handle(self, event: ModelEvent) -> None:
        if isinstance(event, Created) and isinstance(event.model, Link) and event.model.kind in KINDS:
            self.touched(event.model.target.id, event)
        if isinstance(event, Updated) and isinstance(event.model, (Proof, WorkerTodo)):
            for kind in KINDS:
                for ref in self.links.targets(event.model, kind):
                    self.touched(ref.id, event)

    def touched(self, task_id: int, event: ModelEvent) -> None:
        self.tasks.touch(self.tasks.find(task_id), event.actor)
