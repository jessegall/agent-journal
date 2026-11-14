from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.drivers.models.hook_call import HookCall


@dataclass(frozen=True)
class Compaction:
    """A session's last compaction and the context percentages before and after it."""

    started_at: str
    start_percent: int | None
    end_percent: int | None

    @classmethod
    def last(cls, calls: Sequence[HookCall]) -> "Compaction | None":
        compacted = next((position for position in range(len(calls) - 1, -1, -1) if calls[position].is_compaction), None)
        if compacted is None:
            return None
        restart = next((call for call in calls[compacted + 1:] if call.is_compaction_start), None)
        start_percent = calls[compacted].context_percent
        end_percent = restart.context_percent if restart is not None else None
        is_lower = start_percent is not None and end_percent is not None and end_percent < start_percent
        return cls(calls[compacted].creation_timestamp().text, start_percent, end_percent if is_lower else None)

    def json(self) -> Mapping[str, object]:
        return {"started_at": self.started_at, "start_percent": self.start_percent, "end_percent": self.end_percent}
