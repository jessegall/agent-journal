from collections.abc import Iterable

from core.base.database.kept_rows import KeptRows
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.drivers.models.nudge_record import NudgeRecord


class NudgeRecords:
    """Reads the records of lines sent to an agent under the given keys, newest first; a hook reads only the keys
    of its own lines, so the rows it costs do not grow with everything the agent was ever told."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def key_rows(self, agent_id: int, keys: Iterable[str]) -> list[NudgeRecord]:
        wanted = sorted(set(keys))
        rows = self.queries.query(NudgeRecord).filter(session_agent_id=agent_id).matching(Among("key", wanted)).descending("last_delivered_at")
        places = ", ".join("?" for _ in wanted)
        return self.kept.read("nudge_records", lambda: list(rows.all_rows()), f"session_agent_id = ? AND key IN ({places})", [agent_id, *wanted], name="drivers.nudges")
