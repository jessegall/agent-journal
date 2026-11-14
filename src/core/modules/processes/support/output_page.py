from collections.abc import Sequence
from dataclasses import dataclass

from engine.subcommand.output import Output

NEWLINE = b"\n"


@dataclass(frozen=True)
class OutputPage:
    """Some lines of an output and where they stand in it, in bytes, so the next read goes on from there; total is
    the output's size, and cut_bytes the bytes the runner has dropped from it, which grows with each cut."""

    lines: Sequence[str]
    first_byte: int
    last_byte: int
    total: int
    cut_bytes: int = 0

    def write(self, output: Output) -> None:
        output.write("\n".join(self.lines), {"lines": list(self.lines), "first_byte": self.first_byte, "last_byte": self.last_byte, "total": self.total, "cut_bytes": self.cut_bytes})
