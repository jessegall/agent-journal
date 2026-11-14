from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement

PART_COMMAND = "coalesce(nullif(command, ''), text)"
from engine.query.conditions.file_pattern_match import FilePatternMatch
from engine.query.conditions.disjunction import Disjunction


@dataclass(frozen=True)
class CommandMatches:
    """Matches process parts whose command, or text when they have no command, fits one of these glob patterns."""

    patterns: Sequence[str]

    def statement(self) -> Statement:
        return Disjunction([FilePatternMatch(PART_COMMAND, pattern) for pattern in self.patterns]).statement()
