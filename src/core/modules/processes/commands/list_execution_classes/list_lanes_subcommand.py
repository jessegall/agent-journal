from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.support.execution_status import ExecutionStatus


class ListLanesSubcommand(ReadSubcommand[str]):
    """`journal queue-class lanes`: the short and long lanes, their load, what runs and what waits and why."""

    cli_name = "queue-class"
    name = "lanes"

    def __init__(self, status: ExecutionStatus) -> None:
        self.status = status

    def read(self, arguments: Namespace, caller: Caller) -> str:
        return "\n".join(self.status.lines())
