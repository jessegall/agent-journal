from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class Prefix:
    """Matches rows whose text column opens on the given words, taken literally."""

    column: str
    prefix: str

    def statement(self) -> Statement:
        escaped = self.prefix.replace("[", "[[]").replace("*", "[*]").replace("?", "[?]")
        return Statement(f"{self.column} GLOB ?", [escaped + "*"])
