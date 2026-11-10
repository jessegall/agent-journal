from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.developer.support.hook_numbers_file import HookNumbersFile
from core.modules.developer.support.hook_number import HookNumber


class HookNumbersSubcommand(ReadSubcommand[tuple[HookNumber, ...]]):
    """Lists database costs for hooks, readers and routes, by name or highest cost first."""

    cli_name = "developer"
    name = "numbers"

    def __init__(self, numbers: HookNumbersFile) -> None:
        self.numbers = numbers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--costliest", "--slowest", dest="costliest", action="store_true")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[HookNumber, ...]:
        rows = self.numbers.read()
        return tuple(sorted(rows, key=lambda row: -row.most_points) if arguments.costliest else sorted(rows, key=lambda row: row.hook))

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            rows = [row for row in value if isinstance(row, HookNumber)]
            output.write("\n".join(f"{row.hook}: {row.count} at {row.total_points // max(row.count, 1)} points, most {row.most_points} points" for row in rows) or "nothing counted yet", {"rows": [row.json() for row in rows]})
