from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudge_records import NudgeRecords
from core.modules.processes.support.process_nudges import READER_REQUEST, READER_REQUEST_REMINDER


class ReaderRequestNotices:
    """Tracks reader request notices sent to an idle main agent."""

    def __init__(self, queries: Queries, records: NudgeRecords) -> None:
        self.queries, self.records = queries, records

    @staticmethod
    def source(request_id: int) -> str:
        return f"processes.reader-request.{request_id}"

    def has_recent_notice(self, agent_id: int, request_id: int, current_time: Timestamp) -> bool:
        last_line = self.queries.query(AgentLine).filter(session_agent_id=agent_id, source=self.source(request_id)).newest().first()
        record = self.records.newest_row(agent_id, f"{READER_REQUEST.key}.{request_id}")
        timestamps = [last_line.creation_timestamp()] if last_line is not None else []
        if record is not None and record.last_delivered_at is not None:
            timestamps.append(record.last_delivered_at)
        return any(timestamp.elapsed_seconds(current_time) < READER_REQUEST_REMINDER.count for timestamp in timestamps)
