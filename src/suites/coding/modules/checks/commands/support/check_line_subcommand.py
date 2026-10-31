from typing import Generic, TypeVar

from core.base.command.command import Command
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.checks.commands.support.check_lines import CheckLines
from suites.coding.modules.checks.models.check import Check

C = TypeVar("C", bound=Command[Check])


class CheckLineSubcommand(Subcommand[C, Check], Generic[C]):
    """A check command that answers with the one line that tells what the check is."""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Check):
            output.line(CheckLines.made(value))
