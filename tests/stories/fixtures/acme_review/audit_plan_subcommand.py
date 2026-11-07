from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand

from .audit_plan import AuditPlan


class AuditPlanSubcommand(Subcommand[AuditPlan, str]):
    cli_name = "acme"
    name = "audit"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AuditPlan:
        return AuditPlan(arguments.plan_id)
