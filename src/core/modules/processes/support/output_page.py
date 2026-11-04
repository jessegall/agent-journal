from collections.abc import Sequence
from dataclasses import dataclass

from core.base.subcommand.output import Output

NEWLINE = b"\n"


@dataclass(frozen=True)
class OutputPage:
    """Some lines of an output and where they stand in it, in bytes, so the next read goes on from there; total is
    the output's size, which falls when the runner cuts it."""

    lines: Sequence[str]
    first_byte: int
    last_byte: int
    total: int

    def write(self, output: Output) -> None:
        output.write("\n".join(self.lines), {"lines": list(self.lines), "first_byte": self.first_byte, "last_byte": self.last_byte, "total": self.total})
