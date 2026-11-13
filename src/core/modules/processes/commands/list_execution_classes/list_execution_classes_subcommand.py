from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.support.execution_class_lines import ExecutionClassLines


class ListExecutionClassesSubcommand(ReadSubcommand[str]):
    """`journal queue-class list`: every class, its lane, cost, priority and class limit, built-in, changed or your own."""

    cli_name = "queue-class"
    name = "list"

    def __init__(self, lines: ExecutionClassLines) -> None:
        self.class_lines = lines

    def read(self, arguments: Namespace, caller: Caller) -> str:
        return "\n".join(self.class_lines.lines())
