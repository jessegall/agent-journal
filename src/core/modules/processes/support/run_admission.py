from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.test_listings import TestListings
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader_request import ReaderRequest


class RunAdmission:
    """Whether a run may start while its parts wait for readers."""

    def __init__(self, queries: Queries, listings: TestListings, folder: OutputFolder) -> None:
        self.queries, self.listings, self.folder = queries, listings, folder

    def may_start(self, process: Process, current_time: Timestamp) -> bool:
        parts = tuple(self.queries.query(ProcessPart).filter(process_id=process.id).all_rows())
        if not parts:
            return False
        if self.listings.parts(process) and self.folder.count_status(process.id) is None:
            return False
        for part in parts:
            if part.reader_request_id is None:
                continue
            request = self.queries.query(ReaderRequest).find(part.reader_request_id)
            if request.completed_at is None and request.expires_at > current_time and request.sample_process_id != process.id:
                return False
        return True
