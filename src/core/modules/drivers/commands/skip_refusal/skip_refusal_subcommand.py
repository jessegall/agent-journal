from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.skip_refusal.skip_refusal import SkipRefusal
from core.modules.drivers.models.refusal_skip import RefusalSkip


class SkipRefusalSubcommand(Subcommand[SkipRefusal, RefusalSkip]):
    """`journal refusal skip <rule> --reason <why>`: passes the refusal of a rule that just refused you, once."""

    cli_name = "refusal"
    name = "skip"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("rule")
        parser.add_argument("--reason", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> SkipRefusal:
        return SkipRefusal(arguments.rule, arguments.reason)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RefusalSkip):
            output.line(f"skip {value.id} of {value.name}: try again; {value.streak} in a row")
