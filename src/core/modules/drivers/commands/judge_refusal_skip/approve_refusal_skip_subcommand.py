from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.judge_refusal_skip.judge_refusal_skip import JudgeRefusalSkip
from core.modules.drivers.models.refusal_skip import RefusalSkip


class ApproveRefusalSkipSubcommand(Subcommand[JudgeRefusalSkip, RefusalSkip]):
    """`journal refusal approve <skip>`: approves a helper's confirmed skip, which then passes the refusal once."""

    cli_name = "refusal"
    name = "approve"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("skip", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> JudgeRefusalSkip:
        return JudgeRefusalSkip(arguments.skip, True)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RefusalSkip):
            output.line(f"skip {value.id} of {value.name} approved: it passes the refusal once")
