from argparse import ArgumentParser, Namespace
from typing import ClassVar, Generic, TypeVar
from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.render_value import render_value
from core.base.subcommand.rows_value import RowsValue

R = TypeVar("R", covariant=True)


class ReadSubcommand(Generic[R]):
    """One `journal <model> <subcommand>` that only reads: its arguments, the query it runs, and how the rows are
    printed. It never runs a command."""

    row_line: ClassVar[str] = ""
    empty_line: ClassVar[str] = ""

    cli_name: str
    name: str
    help: str = ""

    def arguments(self, parser: ArgumentParser) -> None:
        raise NotImplementedError

    def read(self, arguments: Namespace, caller: Caller) -> R:
        raise NotImplementedError

    def write_output(self, value: object, output: Output) -> None:
        if self.row_line and isinstance(value, RowsValue):
            output.write("\n".join(self.row_line.format_map(row) for row in value.rows) or self.empty_line, value.json())
        else:
            render_value(value, output)
