from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class GlobMatch:
    """Matches rows whose column fits a glob pattern, with * and ? as wildcards and case kept."""

    column: str
    pattern: str

    def statement(self) -> Statement:
        return Statement(f"{self.column} GLOB ?", [self.pattern])
