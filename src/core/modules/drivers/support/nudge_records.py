from collections.abc import Sequence

from core.base.database.kept_rows import KeptRows
from core.base.driver.nudge import Nudge
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.drivers.models.nudge_record import NudgeRecord


class NudgeRecords:
    """Reads the records of the lines an agent is about to be sent, never all of that agent's records."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def newest_row(self, agent_id: int, key: str) -> NudgeRecord | None:
        newest = self.queries.query(NudgeRecord).filter(session_agent_id=agent_id, key=key).descending("last_delivered_at")
        return self.kept.read("nudge_records", newest.first, "session_agent_id = ? AND key = ?", [agent_id, key], name="drivers.nudges.newest")

    def nudge_rows(self, agent_id: int, nudges: Sequence[Nudge]) -> list[NudgeRecord]:
        keys = sorted({nudge.key for nudge in nudges})
        condition = f"session_agent_id = ? AND key IN ({', '.join('?' for _ in keys)})"
        return self.kept.read("nudge_records", lambda: self.loaded_rows(agent_id, nudges), condition, [agent_id, *keys],
                              name=f"drivers.nudges:{sorted({nudge.text for nudge in nudges})}")

    def loaded_rows(self, agent_id: int, nudges: Sequence[Nudge]) -> list[NudgeRecord]:
        clock_keys = sorted({nudge.key for nudge in nudges if nudge.interval})
        newest = [row for row in (self.newest_row(agent_id, key) for key in clock_keys) if row is not None]
        lines = self.queries.query(NudgeRecord).filter(session_agent_id=agent_id).matching(Among("key", tuple(sorted({nudge.key for nudge in nudges})))).matching(Among("text", tuple(sorted({nudge.text for nudge in nudges})))).all_rows()
        return [*newest, *lines]
