from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement
from engine.text.search_term import SearchTerm


@dataclass(frozen=True)
class ContainsSome:
    """Matches rows that hold at least one term, by its stem and whatever its case, in any of the columns."""

    columns: Sequence[str]
    terms: Sequence[str]

    def statement(self) -> Statement:
        tests = " OR ".join(f"instr(lower({column}), ?) > 0" for _ in self.terms for column in self.columns)
        return Statement(f"({tests})", [SearchTerm.stem(term) for term in self.terms for _ in self.columns],
                         scan_reason="User-requested substring searches compare text in the requested fields.")
