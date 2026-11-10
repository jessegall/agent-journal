from collections.abc import Sequence
from dataclasses import dataclass

from core.base.database.statement import Statement
from engine.text.search_term import SearchTerm


@dataclass(frozen=True)
class ContainsMost:
    """Matches rows that hold at least the given number of the terms, by stem and whatever their case, each in
    any of the columns, so the database leaves out the rows that hold too few."""

    columns: Sequence[str]
    terms: Sequence[str]
    enough: int

    def statement(self) -> Statement:
        term_tests = ["(" + " OR ".join(f"instr(lower({column}), ?) > 0" for column in self.columns) + ")" for _ in self.terms]
        return Statement(f"({' + '.join(term_tests)}) >= ?", [*(SearchTerm.stem(term) for term in self.terms for _ in self.columns), self.enough],
                         scan_reason="User-requested substring searches compare text in the requested fields.")
