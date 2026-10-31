from argparse import ArgumentParser, Namespace
from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.messages.commands.send_message import SendMessage
from core.modules.messages.models.message import Message


class ReplyMessageSubcommand(Subcommand[SendMessage, Message]):
    """`journal message reply <message> "<text>"`: writes a message that answers another."""

    cli_name = "message"
    name = "reply"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("parent_id", type=int)
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> SendMessage:
        return SendMessage(arguments.text, arguments.parent_id)
