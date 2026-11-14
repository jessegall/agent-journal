from collections.abc import Sequence

from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.support.run_visibility import RunVisibility


class RunAdmission:
    """Says which waiting runs wait for a reader: a run whose reader request is open waits until it is answered;
    which runs wait for room is the class table's to say."""

    def __init__(self, queries: Queries, visibility: RunVisibility) -> None:
        self.queries, self.visibility = queries, visibility

    # a merge the journal runs itself never waits for a reader, so its parts are not read
    def waiting_parts(self, waiting: Sequence[Process]) -> dict[int, tuple[ProcessPart, ...]]:
        return self.visibility.processes_parts(tuple(process.id for process in waiting if not process.is_journal_merge))

    # a run whose parts are not written yet waits for them as for a reader
    def waits_for_reader(self, process: Process, parts: Sequence[ProcessPart], current_time: Timestamp) -> bool:
        if process.is_journal_merge:
            return False
        if not parts:
            return True
        requests = self.queries.query(ReaderRequest).find_many([part.reader_request_id for part in parts if part.reader_request_id is not None])
        return any(request.completed_at is None and request.expires_at > current_time and request.sample_process_id != process.id for request in requests)
