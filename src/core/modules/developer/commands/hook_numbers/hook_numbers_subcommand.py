from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.developer.support.hook_numbers_file import HookNumber, HookNumbersFile


class HookNumbersSubcommand(ReadSubcommand[tuple[HookNumber, ...]]):
    """`journal developer numbers [--slowest]`: what each kind of hook has cost, by name or slowest first."""

    cli_name = "developer"
    name = "numbers"

    def __init__(self, numbers: HookNumbersFile) -> None:
        self.numbers = numbers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--slowest", action="store_true")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[HookNumber, ...]:
        rows = self.numbers.read()
        return tuple(sorted(rows, key=lambda row: -row.slowest_ms) if arguments.slowest else sorted(rows, key=lambda row: row.hook))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, tuple):
            rows = [row for row in value if isinstance(row, HookNumber)]
            output.write("\n".join(f"{row.hook}: {row.count} at {row.total_ms // max(row.count, 1)} ms, slowest {row.slowest_ms} ms" for row in rows) or "nothing counted yet", {"rows": [row.json() for row in rows]})
