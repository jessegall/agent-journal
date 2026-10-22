from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.task import Task
from journal.models.worker_todo import WorkerTodo
from journal.repositories.linked_rows import LinkedRows
from journal.repositories.links import Links
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository
from journal.support.actor import Actor

TODO_LINK = "todo"


class WorkerTodos(ScopedRepository[WorkerTodo], LinkedRows):
    link_kind = TODO_LINK
    model = WorkerTodo

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links) -> None:
        super().__init__(connection, bus, scope)
        self.links = links

    def appended(self, task: Task, text: str, actor: Actor) -> WorkerTodo:
        return self.added(WorkerTodo(environment_id=task.environment_id, position=len(self.task_items(task)) + 1, text=text), task, actor)

    def task_items(self, task: Task) -> list[WorkerTodo]:
        return sorted(self.children(task), key=lambda item: item.position)

    def task_lists(self, task_ids: set[int]) -> dict[int, list[WorkerTodo]]:
        owners = {link.source.id: link.target.id for link in self.links.all_matching(kind=TODO_LINK) if link.target.id in task_ids}
        lists: dict[int, list[WorkerTodo]] = {}
        for item in sorted(self.numbered(owners), key=lambda item: item.position):
            lists.setdefault(owners[item.row_id], []).append(item)
        return lists
