from argparse import ArgumentParser, Namespace

from core.base.query.queries import Queries
from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_list, is_mapping
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.commands.support.hook_call_view import HookCallView

DRIVERS_MODULE = "journal.core.drivers"


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
        record = call.metadata.module_part(DRIVERS_MODULE)
        layers, rules, dropped = record.get("layers", []), record.get("rules", []), record.get("dropped", [])
        outcomes = [f"{rule['rule']}: {rule['outcome']}" for rule in rules if is_mapping(rule)] if is_list(rules) else []
        return HookCallView(call.id, call.agent_id, call.hook, call.suite, call.driver, call.answer, call.refusal, call.lines.replace("\n", " | "),
                            ", ".join(map(str, layers)) if is_list(layers) else "", ", ".join(outcomes), ", ".join(map(str, dropped)) if is_list(dropped) else "")
