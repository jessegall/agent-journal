from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand

from .note_plan import NotePlan


class NotePlanSubcommand(Subcommand[NotePlan, str]):
    cli_name = "plan-notes"
    name = "add"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> NotePlan:
        return NotePlan(arguments.plan_id)
