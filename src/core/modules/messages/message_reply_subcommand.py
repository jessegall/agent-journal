from argparse import ArgumentParser, Namespace
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.messages.message_send import MessageSend
from core.modules.messages.message import Message


class MessageReplySubcommand(Subcommand[MessageSend, Message]):
    """`journal message reply <message> "<text>"`: writes a message that answers another."""

    cli_name = "message"
    name = "reply"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("parent_id", type=int)
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> MessageSend:
        return MessageSend(arguments.text, arguments.parent_id)
