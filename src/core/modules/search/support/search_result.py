from collections.abc import Sequence
from dataclasses import dataclass
from typing import Any

from engine.library.library_hits import LibraryHits
from core.modules.search.support.search_hit import SearchHit


@dataclass(frozen=True)
class SearchResult:
    """What a search found: the terms, the best hits, how many rows hold every term in all, or, when none does and
    is_closest is set, how many hold most of them, and the items of the team's library that hold them."""

    terms: Sequence[str]
    hits: Sequence[SearchHit]
    total: int
    library: LibraryHits = LibraryHits()
    is_closest: bool = False

    @classmethod
    def restored(cls, stored: dict[str, Any]) -> "SearchResult":
        return cls(stored["terms"], [SearchHit.restored(hit) for hit in stored["hits"]], stored["total"], is_closest=stored["is_closest"])

    def stored(self) -> dict[str, object]:
        return {"terms": list(self.terms), "total": self.total, "is_closest": self.is_closest, "hits": [hit.stored() for hit in self.hits]}

    def lines(self) -> list[str]:
        if not self.hits and not self.library.entries:
            return [f"nothing here holds all of: {' '.join(self.terms)}", *self.library_notice()]
        shown = [f"no row holds all of: {', '.join(self.terms)}, these hold most of them, the closest first", *(hit.line() for hit in self.hits)] if self.is_closest else [hit.line() for hit in self.hits]
        if self.total > len(self.hits) and not self.is_closest:
            shown.append(f"{self.total} rows hold all of: {', '.join(self.terms)}, the newest {len(self.hits)} are shown")
        return [*shown, *(hit.line() for hit in self.library.entries), *self.library_notice()]

    def library_notice(self) -> list[str]:
        return ["the library could not be reached, so these are local results only"] if self.library.is_unreachable else []

    def json(self) -> dict[str, object]:
        listed: dict[str, object] = {"hits": [{"cli_name": hit.cli_name, "id": hit.row_id, "excerpt": hit.excerpt} for hit in self.hits], "total": self.total, **({"closest": True} if self.is_closest else {})}
        return {**listed, "library": [hit.json() for hit in self.library.entries], "library_unreachable_error": self.library.is_unreachable} if self.library.entries or self.library.is_unreachable else listed
