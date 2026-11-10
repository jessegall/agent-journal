from core.base.file_access import FileAccess
import json

from engine.journal.journal_home import JournalHome
from core.modules.developer.support.hook_number import HookNumber

NUMBERS_FILE = "hook-numbers.json"


class HookNumbersFile:
    """The developer's counts of what hooks cost, kept in a file of the journal's runtime folder, so a hook
    writes no row to count itself."""

    def __init__(self, home: JournalHome) -> None:
        self.path = home.system_log.parent / NUMBERS_FILE

    def read(self) -> list[HookNumber]:
        if not self.path.exists():
            return []
        rows = json.loads(FileAccess.shared().read(self.path))
        return [HookNumber(**row) for row in rows if "most_points" in row]

    def add(self, hook: str, points: int) -> None:
        rows = {row.hook: row for row in self.read()}
        kept = rows.get(hook, HookNumber(hook, 0, 0, 0))
        rows[hook] = HookNumber(hook, kept.count + 1, kept.total_points + points, max(kept.most_points, points))
        self.path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(self.path, json.dumps([vars(row) for row in rows.values()]))

    def reset(self) -> None:
        self.path.unlink(missing_ok=True)
