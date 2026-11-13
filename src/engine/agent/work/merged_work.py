from dataclasses import dataclass

from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class MergedWork:
    """What of an agent's work a merge has already taken in: when its last whole hand-in was merged and the
    tasks a merge took in on their own."""

    last_merge_at: Timestamp | None
    task_ids: frozenset[int]

    def includes(self, task_id: int, closed_at: str) -> bool:
        return task_id in self.task_ids or (self.last_merge_at is not None and closed_at <= self.last_merge_at.text)
