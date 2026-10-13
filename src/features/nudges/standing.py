from dataclasses import asdict, dataclass, replace

from framework.loaded import FEATURES
from events.resources import GONE, ResourceEvent, RowChanged
from resources.fields import Loaded
from resources.types import Nudge

STANDING = "standing"
KEPT = 20


@dataclass(frozen=True)
class Standing(Loaded):
    """A line that asked the agent to act and has not been acted on."""
    n: int = 0
    asks: str = ""
    until: tuple[str, ...] = ()
    rows: tuple[str, ...] = ()
    session: str = ""
    at: float = 0.0

    @classmethod
    def of(cls, nudge: Nudge) -> "Standing":
        return cls(n=nudge.n, asks=nudge.asks, until=tuple(nudge.until), rows=tuple(map(str, nudge.data.get("rows") or ())),
                   session=nudge.session, at=nudge.created)

    @property
    def feature(self) -> str:
        return self.asks.partition(".")[0]

    @property
    def line(self) -> str:
        return self.asks.partition(".")[2]

    def is_replaced_by(self, newer: "Standing") -> bool:
        return newer.asks == self.asks and (newer.rows == self.rows or bool(set(newer.rows) & set(self.rows)))

    def is_answered_by(self, event: ResourceEvent) -> bool:
        if f"{event.type}.{event.action}" not in self.until:
            return False
        named = self.named(event.type)
        return not named or f"{event.type}:{event.n}" in named

    def named(self, kind: str) -> list[str]:
        return [ref for ref in self.rows if ref.startswith(f"{kind}:")]

    def struck(self, event: ResourceEvent) -> "Standing":
        return replace(self, rows=tuple(ref for ref in self.rows if ref != f"{event.type}:{event.n}"))

    def is_due(self, every: float, now: float) -> bool:
        return now - self.at >= every

    def is_owed(self, here) -> bool:
        return self.feature in FEATURES and here.is_owed(self.feature, self.line, self.rows)


def standing(memory) -> list[Standing]:
    return [Standing.from_json(raw) for raw in memory.get(STANDING, {}).values()]


def keep(memory, kept: list[Standing]) -> None:
    memory.set(STANDING, {str(s.n): asdict(s) for s in kept[-KEPT:]})


def still_open(nudges) -> set[int]:
    return {row.n for row in nudges.rows.summaries() if row.is_open}


def close(nudges, closed: list[Standing], how: str) -> None:
    standing_rows = still_open(nudges)
    for s in [s for s in closed if s.n in standing_rows]:
        nudges.settle(s.n, how=how)
