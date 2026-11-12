from collections.abc import Sequence
from dataclasses import replace

from engine.listener.deletion_listener import DeletionListener
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader_request import ReaderRequest
from engine.event.deleted import Deleted
from engine.command.context import Context


class ProcessRemovalListener(DeletionListener[Deleted[Process]]):
    """Detaches reader samples from a deleted process."""

    name = "processes.process-removal"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Process], context: Context) -> None:
        self.handle_many([event], context)

    def handle_many(self, events: Sequence[Deleted[Process]], context: Context) -> None:
        requests = tuple(self.queries.query(ReaderRequest).matching(Among("sample_process_id", [event.row.id for event in events])).all_rows())
        for request in requests:
            self.repository.save(replace(request, sample_process_id=None), context)
