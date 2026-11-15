from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.message_records import MessageRecords
from core.modules.processes.agent_messages.reader_request_message import READER_REQUEST_REMINDER
from core.modules.processes.agent_messages.reader_request_message import ReaderRequestMessage


class ReaderRequestNotices:
    """Tracks reader request notices sent to an idle main agent."""

    def __init__(self, queries: Queries, records: MessageRecords, kept: KeptRows) -> None:
        self.queries, self.records, self.kept = queries, records, kept

    @staticmethod
    def source(request_id: int) -> str:
        return f"processes.reader-request.{request_id}"

    def has_recent_notice(self, agent_id: int, request_id: int, current_time: Timestamp) -> bool:
        lines = self.queries.query(AgentLine).filter(session_agent_id=agent_id, source=self.source(request_id)).newest()
        last_line = self.kept.read(lines, lines.first, name="processes.reader-request-notice")
        record = self.records.newest_row(agent_id, f"{ReaderRequestMessage.declared().key}.{request_id}")
        timestamps = [last_line.creation_timestamp()] if last_line is not None else []
        if record is not None and record.last_delivered_at is not None:
            timestamps.append(record.last_delivered_at)
        return any(timestamp.elapsed_seconds(current_time) < READER_REQUEST_REMINDER.count for timestamp in timestamps)
