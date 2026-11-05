from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.developer.models.hook_request import HookRequest
from core.modules.developer.support.hook_request_log import HookRequestLog


class HookRequestsSubcommand(ReadSubcommand[tuple[HookRequest, ...]]):
    """`journal developer hook-requests`: the last hooks as they were sent to the journal, newest first."""

    cli_name = "developer"
    name = "hook-requests"

    def __init__(self, log: HookRequestLog) -> None:
        self.log = log

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> tuple[HookRequest, ...]:
        return tuple(self.log.read())

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            rows = [row for row in value if isinstance(row, HookRequest)]
            output.write("\n".join(f"{row.number}  {row.received_at}  {row.program}" for row in rows) or "nothing recorded yet", {"rows": [row.json() for row in rows]})
