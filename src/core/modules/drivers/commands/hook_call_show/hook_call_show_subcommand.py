from argparse import ArgumentParser, Namespace

from engine.query.queries import Queries
from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.commands.support.hook_call_view import HookCallView


class HookCallShowSubcommand(ReadSubcommand[HookCallView]):
    """`journal hook-call show <id>`: one hook with the layers that were active and each rule's outcome."""

    cli_name = "hook-call"
    name = "show"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> HookCallView:
        call = self.queries.query(HookCall).find(arguments.id)
        return HookCallView(call.id, call.session_agent_id, call.hook, call.suite, call.driver, call.answer, call.refusal, call.lines.replace("\n", " | "),
                            ", ".join(call.layers), ", ".join(call.rule_outcomes), ", ".join(call.dropped_commands))
