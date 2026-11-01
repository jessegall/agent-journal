import json
from collections.abc import Mapping
from dataclasses import dataclass

from core.base.journal_home import JournalHome

NUMBERS_FILE = "hook-numbers.json"


@dataclass(frozen=True)
class HookNumber:
    """What one kind of hook has cost so far: how many ran, their average and slowest time, and their average points."""

    hook: str
    count: int
    total_ms: int
    slowest_ms: int
    total_points: int

    def json(self) -> Mapping[str, object]:
        return {"id": self.hook, "hook": self.hook, "count": self.count, "average_ms": self.total_ms // max(self.count, 1), "slowest_ms": self.slowest_ms, "average_points": self.total_points // max(self.count, 1)}


class HookNumbersFile:
    """The developer's counts of what hooks cost, kept in a file of the journal's runtime folder, so a hook writes no row to count itself."""

    def __init__(self, home: JournalHome) -> None:
        self.path = home.costly_hooks_log.parent / NUMBERS_FILE

    def read(self) -> list[HookNumber]:
        return [HookNumber(**row) for row in json.loads(self.path.read_text())] if self.path.exists() else []

    def add(self, hook: str, milliseconds: int, points: int) -> None:
        rows = {row.hook: row for row in self.read()}
        kept = rows.get(hook, HookNumber(hook, 0, 0, 0, 0))
        rows[hook] = HookNumber(hook, kept.count + 1, kept.total_ms + milliseconds, max(kept.slowest_ms, milliseconds), kept.total_points + points)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps([vars(row) for row in rows.values()]))

    def reset(self) -> None:
        self.path.unlink(missing_ok=True)
