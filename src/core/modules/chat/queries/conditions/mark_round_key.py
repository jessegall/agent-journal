from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class MarkRoundKey:
    """The stored rounds of one listener key."""

    key: str

    @property
    def prefix(self) -> str:
        return f"{self.key}:round:"

    def statement(self) -> Statement:
        pattern = self.prefix.replace("[", "[[]").replace("*", "[*]").replace("?", "[?]") + "*"
        return Statement("(key = ? OR key GLOB ?)", (self.key, pattern))

    def new_key(self, event_id: int) -> str:
        return f"{self.prefix}{event_id}"
