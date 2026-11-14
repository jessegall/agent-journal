from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.support.execution_class_lines import ExecutionClassLines


class ShowExecutionClassSubcommand(ReadSubcommand[str]):
    """`journal queue-class show <name>`: one class as it stands."""

    cli_name = "queue-class"
    name = "show"

    def __init__(self, lines: ExecutionClassLines) -> None:
        self.class_lines = lines

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("class_name")

    def read(self, arguments: Namespace, caller: Caller) -> str:
        line = next((line for line in self.class_lines.lines() if line.startswith(f"{arguments.class_name}:")), None)
        if line is None:
            raise Refusal(f"there is no class {arguments.class_name}", "journal queue-class list names them")
        return line
