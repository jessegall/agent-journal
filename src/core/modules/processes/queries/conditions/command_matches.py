from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement

PART_COMMAND = "coalesce(nullif(command, ''), text)"
from engine.query.conditions.glob_match import GlobMatch
from engine.query.conditions.any_of import AnyOf


@dataclass(frozen=True)
class CommandMatches:
    """Matches process parts whose command, or text when they have no command, fits one of these glob patterns."""

    patterns: Sequence[str]

    def statement(self) -> Statement:
        return AnyOf([GlobMatch(PART_COMMAND, pattern) for pattern in self.patterns]).statement()
