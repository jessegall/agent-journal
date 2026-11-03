from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader_request import ReaderRequest


class RunAdmission:
    """Whether a run may start while its parts wait for readers."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def may_start(self, process: Process, now: Timestamp) -> bool:
        parts = tuple(self.queries.query(ProcessPart).filter(process_id=process.id).all_rows())
        if not parts:
            return False
        for part in parts:
            if part.reader_request_id is None:
                continue
            request = self.queries.query(ReaderRequest).find(part.reader_request_id)
            if request.settled_at is None and request.hold_until > now and request.sample_process_id != process.id:
                return False
        return True
