from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.phone.commands.subscribe_phone import SubscribePhone
from core.modules.phone.models.phone import Phone


class SubscribePhoneSubcommand(Subcommand[SubscribePhone, Phone]):
    """`journal phone subscribe <token-digest> <subscription>`: keeps the push subscription of the paired phone whose
    session has that digest, read from the viewer's listener."""

    cli_name = "phone"
    name = "subscribe"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("token_digest")
        parser.add_argument("subscription")

    def command(self, arguments: Namespace, caller: Caller) -> SubscribePhone:
        return SubscribePhone(arguments.token_digest, arguments.subscription or None)
