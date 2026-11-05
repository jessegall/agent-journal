from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.drivers.models.nudge_record import NudgeRecord


class NudgeRecords:
    """Reads the newest record of a line sent to an agent, by its key alone or by its key and its text."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def newest_row(self, agent_id: int, key: str) -> NudgeRecord | None:
        rows = self.queries.query(NudgeRecord).filter(session_agent_id=agent_id, key=key).descending("last_delivered_at")
        return self.kept.read("nudge_records", rows.first, "session_agent_id = ? AND key = ?", [agent_id, key], name=f"drivers.nudge:{key}")

    def newest_text_row(self, agent_id: int, key: str, text: str) -> NudgeRecord | None:
        rows = self.queries.query(NudgeRecord).filter(session_agent_id=agent_id, key=key, text=text).descending("last_delivered_at")
        return self.kept.read("nudge_records", rows.first, "session_agent_id = ? AND key = ? AND text = ?", [agent_id, key, text], name=f"drivers.nudge:{text}")
