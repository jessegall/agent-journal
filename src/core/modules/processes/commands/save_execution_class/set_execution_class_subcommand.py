from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.execution.classes.execution_classes import ExecutionClasses
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.save_execution_class.save_execution_class import SaveExecutionClass
from core.modules.processes.support.execution_class_options import ExecutionClassOptions
from core.modules.processes.support.stored_execution_classes import StoredExecutionClasses


class SetExecutionClassSubcommand(Subcommand[SaveExecutionClass, str]):
    """`journal queue-class set <name> --lane --cost --priority --limit`: changes a built-in class or one of your own;
    the next line it holds takes the change."""

    cli_name = "queue-class"
    name = "set"
    outward = True

    def __init__(self, store: StoredExecutionClasses) -> None:
        self.classes = ExecutionClasses(store)

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("class_name")
        ExecutionClassOptions.add_arguments(parser)

    def command(self, arguments: Namespace, caller: Caller) -> SaveExecutionClass:
        current = self.classes.named(arguments.class_name)
        if current is None:
            raise Refusal(f"there is no class {arguments.class_name}", "journal queue-class list names them, and journal queue-class add makes one")
        return SaveExecutionClass(ExecutionClassOptions.changed(current, arguments), is_override=True)
