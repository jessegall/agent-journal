from argparse import ArgumentParser, Namespace
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.messages.read_message import ReadMessage
from core.modules.messages.message import Message


class ReadMessageSubcommand(Subcommand[ReadMessage, Message]):
    """`journal message read <message>`: marks a message read."""

    cli_name = "message"
    name = "read"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("message_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ReadMessage:
        return ReadMessage(arguments.message_id)
