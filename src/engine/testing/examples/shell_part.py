from collections.abc import Sequence
from dataclasses import dataclass, field

from engine.driver.command_category import CommandCategory
from engine.driver.command_effect import CommandEffect


@dataclass(frozen=True)
class ShellPart:
    """One part of a sample shell line, as the Go program splits and classifies it."""

    program: str
    category: CommandCategory
    arguments: Sequence[str]
    subcommand: str | None = None
    effects: Sequence[CommandEffect] = field(default_factory=lambda: [CommandEffect.READS_FILES])
    pipe_target: int | None = None
    output_paths: Sequence[str] = ()
    is_full_test_run: bool = False
    uncertain: bool = False
    nested_journal_commands: Sequence[Sequence[str]] = ()

    def prepared(self, text: str) -> dict[str, object]:
        fields: dict[str, object] = {"text": text, "program": self.program, "arguments": list(self.arguments),
                                     "classification": {"category": self.category, "effects": list(self.effects), "uncertain": self.uncertain}}
        fields = {**fields, "write_paths": list(self.output_paths)} if self.output_paths else fields
        fields = {**fields, "nested_journal_commands": [list(command) for command in self.nested_journal_commands]} if self.nested_journal_commands else fields
        fields = {**fields, "is_full_test_run": True} if self.is_full_test_run else fields
        fields = fields if self.pipe_target is None else {**fields, "piped_into": self.pipe_target}
        return fields if self.subcommand is None else {**fields, "subcommand": self.subcommand}
