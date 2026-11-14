from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.remove_execution_class.remove_execution_class import RemoveExecutionClass


class ResetExecutionClassSubcommand(Subcommand[RemoveExecutionClass, str]):
    """`journal queue-class reset <name>`: a built-in class you changed takes its default again."""

    cli_name = "queue-class"
    name = "reset"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("class_name")

    def command(self, arguments: Namespace, caller: Caller) -> RemoveExecutionClass:
        return RemoveExecutionClass(arguments.class_name, is_reset=True)
