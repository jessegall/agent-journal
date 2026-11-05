from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.send_helper.send_helper import SendHelper


class SendHelperSubcommand(Subcommand[SendHelper, None]):
    """`journal helper send <n> "<job>"`."""

    cli_name = "helper"
    name = "send"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("helper_id", type=int)
        parser.add_argument("job")

    def command(self, arguments: Namespace, caller: Caller) -> SendHelper:
        return SendHelper(arguments.helper_id, arguments.job)
