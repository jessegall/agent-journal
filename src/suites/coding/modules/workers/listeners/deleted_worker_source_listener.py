from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.listener.deletion_listener import DeletionListener
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.messages.models.message import Message
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource


class DeletedWorkerSourceListener(DeletionListener[Deleted[Message]]):
    """Keeps deleted request references unavailable in assigned tasks and follow-ups."""

    name = "workers.deleted-source"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Message], context: Context) -> None:
        sources = tuple(self.queries.query(WorkerTaskSource).filter(source_message_id=event.row.id, source_unavailable=False).all_rows())
        for source in sources:
            self.repository.update(source, context, source_unavailable=True)
