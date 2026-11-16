from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.judge_refusal_skip.judge_refusal_skip import JudgeRefusalSkip
from core.modules.drivers.models.driver_grant import DriverGrant


class DeclineRefusalSkipSubcommand(Subcommand[JudgeRefusalSkip, DriverGrant]):
    """`journal refusal decline <skip>`: declines a helper's confirmed skip, so the refusal stays in force."""

    cli_name = "refusal"
    name = "decline"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("skip", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> JudgeRefusalSkip:
        return JudgeRefusalSkip(arguments.skip, False)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, DriverGrant):
            output.line(f"skip {value.id} of {value.policy_key} declined: the refusal stays in force")
