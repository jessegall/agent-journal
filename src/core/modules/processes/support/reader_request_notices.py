from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.nudge_record import NudgeRecord
from core.modules.processes.support.process_nudges import READER_REQUEST, READER_REQUEST_REMINDER


class ReaderRequestNotices:
    """Tracks reader request notices sent to an idle main agent."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    @staticmethod
    def source(request_id: int) -> str:
        return f"processes.reader-request.{request_id}"

    def has_recent_notice(self, agent_id: int, request_id: int, current_time: Timestamp) -> bool:
        lines = self.queries.query(AgentLine).filter(session_agent_id=agent_id, source=self.source(request_id)).newest().limited(1)
        records = self.queries.query(NudgeRecord).filter(session_agent_id=agent_id, key=f"{READER_REQUEST.key}.{request_id}").descending("last_delivered_at").limited(1)
        timestamps = [line.creation_timestamp() for line in lines]
        timestamps.extend(record.last_delivered_at for record in records if record.last_delivered_at is not None)
        return any(timestamp.elapsed_seconds(current_time) < READER_REQUEST_REMINDER.count for timestamp in timestamps)
