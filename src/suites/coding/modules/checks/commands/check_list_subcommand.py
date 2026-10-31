from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from suites.coding.modules.checks.commands.support.check_lines import CheckLines
from suites.coding.modules.checks.models.check import Check
from suites.coding.modules.checks.queries.check_query import CheckQuery


class CheckListSubcommand(ReadSubcommand[Sequence[Check]]):
    """`journal check list`: every check not removed, with whether it passed, failed, is stopped or has not run."""

    cli_name = "check"
    name = "list"

    def __init__(self, checks: CheckQuery) -> None:
        self.checks = checks

    def arguments(self, parser: ArgumentParser) -> None:
        return

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[Check]:
        return tuple(self.checks.kept())

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, Check)] if is_tuple(value) else []
        output.write("\n".join(CheckLines.listed(row) for row in listed), {"rows": [output.values(row) for row in listed]})
