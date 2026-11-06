from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.drivers.models.nudge_record import NudgeRecord


class NudgeRecords:
    """Reads the newest record of a line sent to an agent, by its key alone or by its key and its text."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def agent_rows(self, agent_id: int) -> list[NudgeRecord]:
        rows = self.queries.query(NudgeRecord).filter(session_agent_id=agent_id).descending("last_delivered_at")
        return self.kept.read("nudge_records", lambda: list(rows.all_rows()), "session_agent_id = ?", [agent_id], name="drivers.nudges")
