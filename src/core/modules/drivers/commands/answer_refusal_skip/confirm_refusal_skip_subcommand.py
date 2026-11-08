from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.answer_refusal_skip.answer_refusal_skip import AnswerRefusalSkip
from core.modules.drivers.models.refusal_skip import RefusalSkip


class ConfirmRefusalSkipSubcommand(Subcommand[AnswerRefusalSkip, RefusalSkip]):
    """`journal refusal confirm <skip> --tried <what>`: confirms a held skip, which then passes the refusal once."""

    cli_name = "refusal"
    name = "confirm"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("skip", type=int)
        parser.add_argument("--tried", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> AnswerRefusalSkip:
        return AnswerRefusalSkip(arguments.skip, True, arguments.tried)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RefusalSkip):
            output.line(f"skip {value.id} of {value.name} confirmed: try again")
