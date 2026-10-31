from argparse import ArgumentParser, Namespace
from typing import Generic, TypeIs, TypeVar
from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.command.command import Command
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.subcommand.render_value import render_value


C = TypeVar("C", bound=Command[object], covariant=True)
R = TypeVar("R", covariant=True)
class Subcommand(Generic[C, R]):
    """One `journal <model> <subcommand>` that changes something: its arguments, the command they make, and how
    the result is printed. It holds no rule; the command's guards do. A subcommand that sets background
    is run in the background at once when an agent types it."""

    cli_name: str
    name: str
    help: str = ""
    background: bool = False

    def arguments(self, parser: ArgumentParser) -> None:
        raise NotImplementedError

    def command(self, arguments: Namespace, caller: Caller) -> C:
        raise NotImplementedError

    def write_output(self, value: object, output: Output) -> None:
        render_value(value, output)
def is_subcommand_class(class_type: type) -> TypeIs[type[Subcommand[Command[object], object]] | type[ReadSubcommand[object]]]:
    return issubclass(class_type, (Subcommand, ReadSubcommand))
