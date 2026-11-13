from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.remove_execution_class.remove_execution_class import RemoveExecutionClass


class RemoveExecutionClassSubcommand(Subcommand[RemoveExecutionClass, str]):
    """`journal queue-class remove <name>`: removes a class of your own; a built-in class is reset, never removed."""

    cli_name = "queue-class"
    name = "remove"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("class_name")

    def command(self, arguments: Namespace, caller: Caller) -> RemoveExecutionClass:
        return RemoveExecutionClass(arguments.class_name, is_reset=False)
