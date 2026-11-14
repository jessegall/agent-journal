from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.json_text_list import json_text_list
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.developer.models.hook_request import HookRequest
from core.modules.developer.support.hook_request_log import HookRequestLog


class HookRequestsSubcommand(ReadSubcommand[tuple[HookRequest, ...]]):
    """`journal developer hook-requests`: the last hooks as they were sent to the journal, newest first."""

    cli_name = "developer"
    name = "hook-requests"

    def __init__(self, log: HookRequestLog) -> None:
        self.log = log

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--kind", dest="category", action="append", default=[])
        parser.add_argument("--family", action="append", default=[])
        parser.add_argument("--sender", action="append", default=[])
        for name in ("categories", "families", "senders"):
            parser.add_argument(f"--{name}", type=json_text_list, default=[])

    def read(self, arguments: Namespace, caller: Caller) -> tuple[HookRequest, ...]:
        return tuple(self.log.filtered([*arguments.category, *arguments.categories], [*arguments.family, *arguments.families], [*arguments.sender, *arguments.senders]))

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            rows = [row for row in value if isinstance(row, HookRequest)]
            options = self.log.filter_options()
            output.write("\n".join(f"{row.number}  {row.received_at}  {row.sender}  {row.queued_ms:.0f} ms  {row.duration_ms:.0f} ms  {row.event}" for row in rows) or "nothing recorded yet", {"rows": [row.json() for row in rows], "families": sorted({family for family, _ in options}), "senders": sorted({sender for _, sender in options})})
