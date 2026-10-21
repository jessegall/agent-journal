import re
from dataclasses import dataclass

COMMANDS_PREFIX = "commands: "


@dataclass(frozen=True)
class ReaderCommands:
    """The commands a reader reads the output of, such as pytest or dotnet test: a shell line runs one when it names it as a word of its own."""

    programs: tuple[str, ...] = ()

    @classmethod
    def parsed(cls, text: str) -> "ReaderCommands":
        return cls(tuple(word.strip() for word in text.split(",") if word.strip()))

    def text(self) -> str:
        return ", ".join(self.programs)

    def is_read(self, line: str) -> bool:
        return any(re.search(rf"(^|[\s/]){re.escape(program)}(\s|$)", line) for program in self.programs)
