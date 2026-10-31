from argparse import ArgumentParser, Namespace
from dataclasses import is_dataclass
from typing import Generic, TypeIs, TypeVar

from core.base.subcommand.caller import Caller
from core.base.subcommand.output import Output
from core.base.command.command import Command
from core.base.model.model import Model
from core.base.page import is_page

C = TypeVar("C", bound=Command[object], covariant=True)
R = TypeVar("R", covariant=True)


class Subcommand(Generic[C, R]):
    """One `journal <model> <subcommand>` that changes something: its arguments, the command they make, and how
    the result is printed. It holds no rule; the command's guards do."""

    cli_name: str
    name: str
    help: str = ""

    def arguments(self, parser: ArgumentParser) -> None:
        raise NotImplementedError

    def command(self, arguments: Namespace, caller: Caller) -> C:
        raise NotImplementedError

    def write_output(self, value: object, output: Output) -> None:
        render_value(value, output)


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


def render_value(value: object, output: Output) -> None:
    if is_page(value):
        output.page(value)
    elif isinstance(value, Model) or (is_dataclass(value) and not isinstance(value, type)):
        output.row(value)
    else:
        output.line(str(value))


def is_subcommand_class(class_type: type) -> TypeIs[type[Subcommand[Command[object], object]] | type[ReadSubcommand[object]]]:
    return issubclass(class_type, (Subcommand, ReadSubcommand))
