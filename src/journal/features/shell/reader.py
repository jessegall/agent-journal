import re
from dataclasses import dataclass
from pathlib import Path

from journal.refused import Refused


@dataclass(frozen=True)
class Reader:
    """A named way to read outputs of one shape: the lines a pattern picks, with their numbers."""

    name: str
    about: str
    pattern: str

    @classmethod
    def from_file(cls, path: Path) -> "Reader":
        """A pattern reader's file: its first line says what it picks, after a #, and its second is the pattern."""
        lines = path.read_text().splitlines()
        if len(lines) < 2:
            raise Refused(f"reader {path.stem} needs two lines: '# what it picks', then its pattern")
        return cls(path.stem, lines[0].removeprefix("#").strip(), lines[1])

    def text(self) -> str:
        return f"# {self.about}\n{self.pattern}\n"

    def read(self, lines: list[str]) -> list[str]:
        found = re.compile(self.pattern)
        return [f"{i}: {line}" for i, line in enumerate(lines, 1) if found.search(line)]
