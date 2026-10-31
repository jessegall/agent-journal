from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.phone.commands.redeem_phone_code import RedeemPhoneCode
from core.modules.phone.models.phone import Phone

PHONE_NAME = "Phone"


class RedeemPhoneCodeSubcommand(Subcommand[RedeemPhoneCode, Phone]):
    """`journal phone redeem <code> --token-digest <digest>`: run by the viewer's listener when a phone
    brings a code."""

    cli_name = "phone"
    name = "redeem"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("code")
        parser.add_argument("--token-digest", required=True)
        parser.add_argument("--name", default=PHONE_NAME)

    def command(self, arguments: Namespace, caller: Caller) -> RedeemPhoneCode:
        return RedeemPhoneCode(arguments.code, arguments.token_digest, arguments.name)

    def write_output(self, value: object, output: Output) -> None:
        output.row(value)
