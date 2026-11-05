from collections.abc import Sequence
from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class ContainsEvery:
    """Matches rows that hold every term, whatever its case, each in any of the columns."""

    columns: Sequence[str]
    terms: Sequence[str]

    def statement(self) -> Statement:
        term_tests = ["(" + " OR ".join(f"instr(lower({column}), ?) > 0" for column in self.columns) + ")" for _ in self.terms]
        return Statement(" AND ".join(term_tests), [term.lower() for term in self.terms for _ in self.columns],
                         scan_reason="User-requested substring searches compare text in the requested fields.")
