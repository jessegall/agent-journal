from collections.abc import Sequence
from dataclasses import dataclass, field

from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect


@dataclass(frozen=True)
class ShellPart:
    """One part of a sample shell line, as the Go program splits and classifies it."""

    program: str
    category: CommandCategory
    arguments: Sequence[str]
    subcommand: str | None = None
    effects: Sequence[CommandEffect] = field(default_factory=lambda: [CommandEffect.READS_FILES])

    def prepared(self, text: str) -> dict[str, object]:
        fields: dict[str, object] = {"text": text, "program": self.program, "arguments": list(self.arguments),
                                     "classification": {"category": self.category, "effects": list(self.effects)}}
        return fields if self.subcommand is None else {**fields, "subcommand": self.subcommand}
