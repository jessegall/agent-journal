from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.drivers.models.hook_call import HookCall


@dataclass(frozen=True)
class Compaction:
    """The last compaction of a session: when it started, the percent of the context in use just before it, and the
    percent measured when the session started again after it. The percent after is kept only when it is lower than the
    one before, since a program's reading right after a compaction may still hold the old turn's usage."""

    at: str
    from_percent: int | None
    to_percent: int | None

    @classmethod
    def last(cls, calls: Sequence[HookCall]) -> "Compaction | None":
        """From the hook calls of one session, oldest first."""
        compacted = next((position for position in range(len(calls) - 1, -1, -1) if calls[position].is_compaction), None)
        if compacted is None:
            return None
        started = next((call for call in calls[compacted + 1:] if call.is_compaction_start), None)
        before = calls[compacted].context_percent
        after = started.context_percent if started is not None else None
        return cls(calls[compacted].creation_timestamp().text, before, after if before is not None and after is not None and after < before else None)

    def json(self) -> Mapping[str, object]:
        return {"at": self.at, "from_percent": self.from_percent, "to_percent": self.to_percent}
