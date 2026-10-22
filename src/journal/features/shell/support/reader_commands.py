import re
from dataclasses import dataclass

from journal.support.chain import Chain
from journal.support.command_shape import CommandShape

COMMANDS_PREFIX = "commands: "


@dataclass(frozen=True)
class ReaderCommands:
    """The commands a reader reads the output of, such as pytest or dotnet test: a shell line runs one when the shape of one of its parts, its program and subcommands, names it, never a value passed or text a part carries."""

    programs: tuple[str, ...] = ()

    @classmethod
    def parsed(cls, text: str) -> "ReaderCommands":
        return cls(tuple(word.strip() for word in text.split(",") if word.strip()))

    def text(self) -> str:
        return ", ".join(self.programs)

    def is_read(self, line: str) -> bool:
        shapes = [CommandShape.build(part.text) for part in Chain.parts(line)]
        return any(re.search(rf"(^|[\s/]){re.escape(program)}(\s|$)", shape) for program in self.programs for shape in shapes)
