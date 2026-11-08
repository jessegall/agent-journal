from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.answer_refusal_skip.answer_refusal_skip import AnswerRefusalSkip
from core.modules.drivers.models.refusal_skip import RefusalSkip


class CancelRefusalSkipSubcommand(Subcommand[AnswerRefusalSkip, RefusalSkip]):
    """`journal refusal withdraw <skip>`: withdraws a held skip, so the refusal stays in force."""

    cli_name = "refusal"
    name = "withdraw"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("skip", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AnswerRefusalSkip:
        return AnswerRefusalSkip(arguments.skip, False)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RefusalSkip):
            output.line(f"skip {value.id} of {value.name} withdrawn: do what the refusal asks")
