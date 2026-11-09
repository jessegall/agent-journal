import json
from collections.abc import Sequence
from pathlib import Path

from core.base.clock import Clock
from core.base.file_access import FileAccess
from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
from core.modules.search.support.search_hit import SearchHit
from core.modules.search.support.search_result import SearchResult

KEPT_SECONDS = 30


class SearchOutcomes:
    """The result a search's chat mark worked out, handed to the run of that same search so the two read the
    rows once. It is kept in a file, since each command line builds new objects, and it is read_once only once and
    only for a short while, so a later search reads the rows as they are then."""

    def __init__(self, home: JournalHome, clock: Clock) -> None:
        self.home, self.clock = home, clock

    def keep(self, agent_id: int, terms: Sequence[str], models: Sequence[str], search_result: SearchResult) -> None:
        file = self.file(agent_id)
        file.parent.mkdir(parents=True, exist_ok=True)
        hits = [{"cli_name": hit.cli_name, "row_id": hit.row_id, "created_at": hit.created_at.text, "excerpt": hit.excerpt, "matched_terms": hit.matched_terms, "rank": hit.rank} for hit in search_result.hits]
        FileAccess.shared().write(file, json.dumps({"kept_at": self.clock.timestamp().text, "terms": list(terms), "models": list(models), "total": search_result.total, "is_closest": search_result.is_closest, "hits": hits}))

    def read_once(self, agent_id: int, terms: Sequence[str], models: Sequence[str]) -> SearchResult | None:
        file = self.file(agent_id)
        if not file.is_file():
            return None
        kept = json.loads(FileAccess.shared().read(file))
        file.unlink(missing_ok=True)
        if kept["terms"] != list(terms) or kept["models"] != list(models) or Timestamp.parsed(kept["kept_at"]).elapsed_seconds(self.clock.timestamp()) > KEPT_SECONDS:
            return None
        hits = [SearchHit(hit["cli_name"], hit["row_id"], Timestamp.parsed(hit["created_at"]), hit["excerpt"], hit["matched_terms"], hit["rank"]) for hit in kept["hits"]]
        return SearchResult(terms, hits, kept["total"], is_closest=kept["is_closest"])

    def file(self, agent_id: int) -> Path:
        return self.home.folder / "runtime" / "search_outcomes" / f"{agent_id}.json"
