import re
from dataclasses import dataclass
from pathlib import Path

from journal.features.shell.support.progress import Progress
from journal.features.shell.support.reader_commands import COMMANDS_PREFIX, ReaderCommands
from journal.support.rejection import Rejection

PROGRESS_PREFIX = "progress: "
LABEL_PREFIX = "label: "


@dataclass(frozen=True)
class Reader:
    """A named way to read outputs of one shape: the lines a pattern picks, with their numbers, how far the command has come by the last match of a progress pattern, and the commands whose output it reads."""

    name: str
    subject: str
    pattern: str
    progress_pattern: str = ""
    label: str = ""
    commands: ReaderCommands = ReaderCommands()

    @classmethod
    def loaded(cls, path: Path) -> "Reader":
        lines = path.read_text().splitlines()
        if len(lines) < 2:
            raise Rejection(f"reader {path.stem} needs two lines: '# what it picks', then its pattern")
        settings = {prefix: line.removeprefix(prefix) for line in lines[2:] for prefix in (PROGRESS_PREFIX, LABEL_PREFIX, COMMANDS_PREFIX) if line.startswith(prefix)}
        return cls(path.stem, lines[0].removeprefix("#").strip(), lines[1], settings.get(PROGRESS_PREFIX, ""), settings.get(LABEL_PREFIX, ""), ReaderCommands.parsed(settings.get(COMMANDS_PREFIX, "")))

    def text(self) -> str:
        extra = [f"{prefix}{value}" for prefix, value in ((PROGRESS_PREFIX, self.progress_pattern), (LABEL_PREFIX, self.label), (COMMANDS_PREFIX, self.commands.text())) if value]
        return "\n".join([f"# {self.subject}", self.pattern, *extra]) + "\n"

    def matches(self, command: str) -> bool:
        return self.pattern in command

    def read(self, lines: list[str]) -> list[str]:
        rows = re.compile(self.pattern)
        return [f"{i}: {line}" for i, line in enumerate(lines, 1) if rows.search(line)]

    def progress(self, lines: list[str]) -> Progress:
        return Progress.found(self.progress_pattern, self.label, lines)
