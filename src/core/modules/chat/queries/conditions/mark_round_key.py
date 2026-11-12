from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.equal import Equal
from engine.query.conditions.glob_match import GlobMatch


@dataclass(frozen=True)
class MarkRoundKey:
    """The stored rounds of one listener key."""

    key: str

    @property
    def prefix(self) -> str:
        return f"{self.key}:round:"

    def statement(self) -> Statement:
        pattern = self.prefix.replace("[", "[[]").replace("*", "[*]").replace("?", "[?]") + "*"
        return AnyOf([Equal("key", self.key), GlobMatch("key", pattern)]).statement()

    def new_key(self, event_id: int) -> str:
        return f"{self.prefix}{event_id}"
