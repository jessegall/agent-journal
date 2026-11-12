from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.messages.support.work_source_copy import WorkSourceCopy
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.task_source_copy import TaskSourceCopy

COPIES_REASON = "every task of the unit gets the source copy of the message it came from"


class WorkerTaskCopies:
    """Captures the request behind each task handed to a worker: the task's own subject message, or the fallback."""

    def __init__(self, queries: Queries, scopes: Scopes) -> None:
        self.queries, self.scopes = queries, scopes

    def copies(self, tasks: list[Task], fallback: WorkSourceCopy) -> tuple[TaskSourceCopy, ...]:
        with self.scopes.opened(self.scopes.actor_id, fallback.environment_id):
            return self.copy_rows(tasks, fallback)

    def copy_rows(self, tasks: list[Task], fallback: WorkSourceCopy) -> tuple[TaskSourceCopy, ...]:
        links = self.queries.query(Link).filter(source_model=Message.model_name, target_model=Task.model_name, link_type=LinkType.SUBJECT)
        edges = tuple(sorted(links.matching(Among("target_id", [task.id for task in tasks])).every_row(COPIES_REASON), key=lambda edge: edge.id, reverse=True))
        messages = self.queries.query(Message).matching(Among("type", PERSON_MESSAGE_TYPES))
        available = {message.id for message in messages.matching(Among("id", tuple({edge.source_id for edge in edges}))).every_row(COPIES_REASON)}
        task_copies: dict[int, WorkSourceCopy] = {}
        for link in edges:
            task_copies.setdefault(link.target_id, WorkSourceCopy(link.source_id, 0, fallback.environment_id, link.source_id not in available))
        return tuple(TaskSourceCopy(task.id, task_copies.get(task.id, fallback)) for task in tasks)
