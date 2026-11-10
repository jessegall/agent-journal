from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.send_helper.send_helper import SendHelper


class SendHelperSubcommand(Subcommand[SendHelper, int]):
    """`journal helper send <n> "<job>"`."""

    cli_name = "helper"
    name = "send"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("helper_id", type=int)
        parser.add_argument("job")
        parser.add_argument("--plan", type=int, default=None, help="the plan this job reviews")
        parser.add_argument("--title", default="", help="a short title for the job, shown in the agent list")
        parser.add_argument("--steer", action="store_true", help="add this to the job the helper is working on")

    def command(self, arguments: Namespace, caller: Caller) -> SendHelper:
        return SendHelper(arguments.helper_id, arguments.job, arguments.steer, arguments.plan, arguments.title)

    def write_output(self, value: object, output: Output) -> None:
        output.write(f"helper {value} takes the job", {"helper_id": value})

