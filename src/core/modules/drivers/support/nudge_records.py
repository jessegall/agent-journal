from collections.abc import Sequence

from engine.database.kept_rows import KeptRows
from engine.driver.nudge import Nudge
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.drivers.models.nudge_record import NudgeRecord


class NudgeRecords:
    """Reads the records of the lines an agent is about to be sent, never all of that agent's records."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def newest_row(self, agent_id: int, key: str) -> NudgeRecord | None:
        newest = self.queries.query(NudgeRecord).filter(session_agent_id=agent_id, key=key).descending("last_delivered_at")
        return self.kept.read(newest, newest.first, name="drivers.nudges.newest")

    def nudge_rows(self, agent_id: int, nudges: Sequence[Nudge]) -> list[NudgeRecord]:
        records = self.queries.query(NudgeRecord).filter(session_agent_id=agent_id).matching(Among("key", tuple(sorted({nudge.key for nudge in nudges}))))
        return self.kept.read(records, lambda: self.loaded_rows(agent_id, nudges), name=f"drivers.nudges:{sorted({nudge.text for nudge in nudges})}")

    def loaded_rows(self, agent_id: int, nudges: Sequence[Nudge]) -> list[NudgeRecord]:
        clock_keys = sorted({nudge.key for nudge in nudges if nudge.interval})
        newest = [row for row in (self.newest_row(agent_id, key) for key in clock_keys) if row is not None]
        lines = self.queries.query(NudgeRecord).filter(session_agent_id=agent_id).matching(Among("key", tuple(sorted({nudge.key for nudge in nudges})))).matching(Among("text", tuple(sorted({nudge.text for nudge in nudges})))).all_rows()
        return [*newest, *lines]
