from argparse import ArgumentParser, Namespace
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.messages.message_read import MessageRead
from core.modules.messages.message import Message


class MessageReadSubcommand(Subcommand[MessageRead, Message]):
    """`journal message read <message>`: marks a message read."""

    cli_name = "message"
    name = "read"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("message_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> MessageRead:
        return MessageRead(arguments.message_id)
