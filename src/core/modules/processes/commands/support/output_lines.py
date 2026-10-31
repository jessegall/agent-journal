from argparse import ArgumentParser
from collections.abc import Sequence
from dataclasses import dataclass

from core.base.subcommand.output import Output


@dataclass(frozen=True)
class OutputLines:
    """The lines a read of outputs prints, and the flags every read of an output takes."""

    lines: Sequence[str]

    @staticmethod
    def add_flags(parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)
        parser.add_argument("--summary", action="store_true")
        parser.add_argument("--all", action="store_true")
        parser.add_argument("--lines", default="")
        parser.add_argument("--tail", type=int)
        parser.add_argument("--reader", default="")

    def write(self, output: Output, empty: str = "") -> None:
        output.write("\n".join(self.lines) or empty, {"lines": list(self.lines)})
