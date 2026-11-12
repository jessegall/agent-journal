import json
from collections.abc import Sequence
from pathlib import Path

from engine.time.clock import Clock
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.time.timestamp import Timestamp
from core.modules.search.support.search_result import SearchResult

KEPT_SECONDS = 30


class SearchOutcomes:
    """The result a search's chat mark worked out, handed to the run of that same search so the two read the
    rows once. It is kept in a file, since each command line builds new objects, and it is read only once and
    only for a short while, so a later search reads the rows as they are then."""

    def __init__(self, home: JournalHome, clock: Clock) -> None:
        self.home, self.clock = home, clock

    def keep(self, agent_id: int, terms: Sequence[str], models: Sequence[str], search_result: SearchResult) -> None:
        file = self.file(agent_id)
        file.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(file, json.dumps({**search_result.stored(), "kept_at": self.clock.timestamp().text, "terms": list(terms), "models": list(models)}))

    def read_once(self, agent_id: int, terms: Sequence[str], models: Sequence[str]) -> SearchResult | None:
        file = self.file(agent_id)
        if not file.is_file():
            return None
        kept = json.loads(FileAccess.shared().read(file))
        file.unlink(missing_ok=True)
        if kept["terms"] != list(terms) or kept["models"] != list(models) or Timestamp.parsed(kept["kept_at"]).elapsed_seconds(self.clock.timestamp()) > KEPT_SECONDS:
            return None
        try:
            return SearchResult.restored(kept)
        except KeyError:
            return None

    def file(self, agent_id: int) -> Path:
        return self.home.folder / "runtime" / "search_outcomes" / f"{agent_id}.json"
