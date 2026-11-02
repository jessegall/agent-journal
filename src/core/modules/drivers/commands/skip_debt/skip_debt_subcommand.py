from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.settle_debt.settle_debt import SettleDebt
from core.modules.drivers.models.nudge_debt import NudgeDebt


class SkipDebtSubcommand(Subcommand[SettleDebt, NudgeDebt]):
    """`journal debt skip <n> --reason <why>`: leaves a line's command unrun, saying why; the chat shows it."""

    cli_name = "debt"
    name = "skip"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("debt_id", type=int)
        parser.add_argument("--reason", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> SettleDebt:
        if not arguments.reason.strip():
            raise Refusal("say why the line does not apply", "--reason '<why>'")
        return SettleDebt(arguments.debt_id, arguments.reason.strip())

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, NudgeDebt):
            output.line(f"debt {value.id} skipped: {value.skip_reason}")
