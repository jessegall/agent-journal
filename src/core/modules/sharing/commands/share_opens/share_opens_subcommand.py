from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.argument_alias import declare_argument_alias
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.subcommand.row_list import RowList
from core.modules.plans.support.plan_shared_rows import PlanSharedRows
from core.modules.sharing.commands.support.share_targets import ShareTargets

PLAN_MODEL = "plan"


class ShareOpensSubcommand(ReadSubcommand[RowList]):
    """`journal share opens plans:2`: what whoever has a link to this row can view."""

    cli_name = "share"
    name = "opens"

    def __init__(self, targets: ShareTargets, included: PlanSharedRows) -> None:
        self.targets, self.included = targets, included

    def arguments(self, parser: ArgumentParser) -> None:
        declare_argument_alias(parser, "target")

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        shared = self.targets.row(arguments.target)
        included = self.included.rows(shared.id) if shared.model_name == PLAN_MODEL else []
        lines = [f"{shared.model_name.capitalize()} {shared.id}, {shared.title}", *(f"{len(group.ids)} {group.model}{'' if len(group.ids) == 1 else 's'}" for group in included)]
        return RowList([{"id": index, "line": line} for index, line in enumerate(lines)])

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RowList):
            output.write("\n".join(str(row["line"]) for row in value.rows), value.json())
