from collections.abc import Sequence
from dataclasses import dataclass

from engine.subcommand.output import Output
from core.modules.processes.support.colour_codes import ColourCodes

NEWLINE = b"\n"


@dataclass(frozen=True)
class OutputPage:
    """Some lines of an output and where they stand in it, in bytes, so the next read goes on from there;
    total is the output's size, and cut_bytes the bytes the runner has dropped from it, which grows with
    each cut. The lines are kept as the run wrote them, colour codes included, for a terminal to show."""

    stored_lines: Sequence[str]
    first_byte: int
    last_byte: int
    total: int
    cut_bytes: int = 0

    @property
    def lines(self) -> list[str]:
        return [ColourCodes.removed(line) for line in self.stored_lines]

    def shown_lines(self, output: Output) -> Sequence[str]:
        return self.stored_lines if output.is_terminal else self.lines

    def write(self, output: Output) -> None:
        output.write("\n".join(self.lines), {"lines": list(self.lines), "first_byte": self.first_byte, "last_byte": self.last_byte, "total": self.total, "cut_bytes": self.cut_bytes})
