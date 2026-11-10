from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand


class SkipSavedCommandSubcommand(ReadSubcommand[str]):
    """`journal alias skip --reason "<why>" && <line>`: lets one line run as written, without its saved commands;
    it changes nothing, and the rule reads it at the head of the line."""

    cli_name = "alias"
    name = "skip"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--reason", required=True)

    def read(self, arguments: Namespace, caller: Caller) -> str:
        return arguments.reason

    def write_output(self, value: object, output: Output) -> None:
        output.line(f"running as written: {value}")
