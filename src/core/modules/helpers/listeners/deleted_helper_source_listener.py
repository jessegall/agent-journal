from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.listener.deletion_listener import DeletionListener
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.messages.models.message import Message


class DeletedHelperSourceListener(DeletionListener[Deleted[Message]]):
    """Keeps deleted request references unavailable in all affected helper jobs."""

    name = "helpers.deleted-source"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Message], context: Context) -> None:
        jobs = tuple(self.queries.query(HelperJob).filter(source_message_id=event.row.id, source_unavailable=False).all_rows())
        for job in jobs:
            self.repository.update(job, context, source_unavailable=True)
