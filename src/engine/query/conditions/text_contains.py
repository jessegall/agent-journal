from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class TextContains:
    """Matches rows whose text column holds the given text exactly, case kept."""

    column: str
    text: str

    def statement(self) -> Statement:
        return Statement(f"instr({self.column}, ?) > 0", [self.text], scan_reason="A text search compares the text of the rows the other conditions leave.")
