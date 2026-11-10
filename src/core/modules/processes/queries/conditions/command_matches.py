from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class CommandMatches:
    """Matches process parts whose command, or text when they have no command, fits one of these glob patterns."""

    patterns: Sequence[str]

    def statement(self) -> Statement:
        tests = " OR ".join("coalesce(nullif(command, ''), text) GLOB ?" for _ in self.patterns)
        return Statement(f"({tests})", list(self.patterns))
