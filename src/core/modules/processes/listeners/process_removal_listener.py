from dataclasses import replace

from core.base.change.change import Change
from core.base.listener.deletion_listener import DeletionListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.support.output_folder import OutputFolder


class ProcessRemovalListener(DeletionListener):
    """Detaches reader samples and removes a deleted process's folder."""

    name = "processes.process-removal"
    event = "process.delete"

    def __init__(self, queries: Queries, repository: Repository, folder: OutputFolder) -> None:
        self.queries, self.repository, self.folder = queries, repository, folder

    def handle(self, change: Change[Model]) -> None:
        process = change.row
        if not isinstance(process, Process):
            return
        requests = tuple(self.queries.query(ReaderRequest).filter(sample_process_id=process.id).all_rows())
        for request in requests:
            self.repository.save(replace(request, sample_process_id=None), change.context)
        self.folder.remove(process.id)
