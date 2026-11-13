from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.disjunction import Disjunction
from engine.query.conditions.equal import Equal
from engine.query.conditions.glob_condition import GlobCondition


@dataclass(frozen=True)
class MarkRoundKey:
    """The stored rounds of one listener key."""

    key: str

    @property
    def prefix(self) -> str:
        return f"{self.key}:round:"

    def statement(self) -> Statement:
        pattern = self.prefix.replace("[", "[[]").replace("*", "[*]").replace("?", "[?]") + "*"
        return Disjunction([Equal("key", self.key), GlobCondition("key", pattern)]).statement()

    def new_key(self, event_id: int) -> str:
        return f"{self.prefix}{event_id}"
