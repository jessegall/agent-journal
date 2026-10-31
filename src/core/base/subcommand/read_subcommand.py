from argparse import ArgumentParser, Namespace
from typing import Generic, TypeVar
from core.base.subcommand.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.render_value import render_value

R = TypeVar("R", covariant=True)


class ReadSubcommand(Generic[R]):
    """One `journal <model> <subcommand>` that only reads: its arguments, the query it runs, and how the rows are
    printed. It never runs a command."""

    cli_name: str
    name: str
    help: str = ""

    def arguments(self, parser: ArgumentParser) -> None:
        raise NotImplementedError

    def read(self, arguments: Namespace, caller: Caller) -> R:
        raise NotImplementedError

    def write_output(self, value: object, output: Output) -> None:
        render_value(value, output)
