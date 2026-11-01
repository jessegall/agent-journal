from core.base.journal_home import JournalHome
from core.modules.developer.support.hook_number import HookNumber
import json

NUMBERS_FILE = "hook-numbers.json"


class HookNumbersFile:
    """The developer's counts of what hooks cost, kept in a file of the journal's runtime folder, so a hook
    writes no row to count itself."""

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
