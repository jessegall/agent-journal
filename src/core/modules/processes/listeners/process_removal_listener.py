from dataclasses import replace

from core.base.listener.deletion_listener import DeletionListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader_request import ReaderRequest
from engine.change.deleted import Deleted
from engine.command.context import Context


class ProcessRemovalListener(DeletionListener[Deleted[Process]]):
    """Detaches reader samples from a deleted process."""

    name = "processes.process-removal"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Process], context: Context) -> None:
        process = event.row
        requests = tuple(self.queries.query(ReaderRequest).filter(sample_process_id=process.id).all_rows())
        for request in requests:
            self.repository.save(replace(request, sample_process_id=None), context)
