from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.phone.commands.pair_phone import PairPhone
from core.modules.phone.commands.support.phone_invitation import PhoneInvitation


class PairPhoneSubcommand(Subcommand[PairPhone, PhoneInvitation]):
    """`journal phone pair`: a code and a link that pair one phone with the viewer as you, for ten minutes."""

    cli_name = "phone"
    name = "pair"

    def arguments(self, parser: ArgumentParser) -> None:
        return

    def command(self, arguments: Namespace, caller: Caller) -> PairPhone:
        return PairPhone()

    def write_output(self, value: object, output: Output) -> None:
        output.row(value)
