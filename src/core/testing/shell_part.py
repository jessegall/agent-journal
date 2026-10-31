from collections.abc import Sequence
from dataclasses import dataclass, field


@dataclass(frozen=True)
class ShellPart:
    """One part of a sample shell line, as the Go program splits and classifies it."""

    program: str
    category: str
    arguments: Sequence[str]
    subcommand: str | None = None
    effects: Sequence[str] = field(default_factory=lambda: ["reads_files"])

    def prepared(self, text: str) -> dict[str, object]:
        fields: dict[str, object] = {"text": text, "program": self.program, "arguments": list(self.arguments),
                                     "classification": {"kind": self.category, "effects": list(self.effects)}}
        return fields if self.subcommand is None else {**fields, "subcommand": self.subcommand}
