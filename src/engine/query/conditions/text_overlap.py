from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class TextOverlap:
    """Matches rows whose text column is not empty and lies inside the given text, or holds it, taken literally."""

    column: str
    text: str

    def statement(self) -> Statement:
        return Statement(f"({self.column} != '' AND (instr(?, {self.column}) > 0 OR instr({self.column}, ?) > 0))", [self.text, self.text],
                         scan_reason="A transcript row is matched to the line whose text it holds, within one agent's lines.")
