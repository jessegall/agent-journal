from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.judge_refusal_skip.judge_refusal_skip import JudgeRefusalSkip
from core.modules.drivers.models.refusal_skip import RefusalSkip


class DeclineRefusalSkipSubcommand(Subcommand[JudgeRefusalSkip, RefusalSkip]):
    """`journal refusal decline <skip>`: declines a helper's or worker's confirmed skip, so the refusal stays in force."""

    cli_name = "refusal"
    name = "decline"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("skip", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> JudgeRefusalSkip:
        return JudgeRefusalSkip(arguments.skip, False)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RefusalSkip):
            output.line(f"skip {value.id} of {value.name} declined: the refusal stays in force")
