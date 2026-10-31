from argparse import ArgumentParser, Namespace
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.messages.message_send import MessageSend
from core.modules.messages.message import Message


class MessageSendSubcommand(Subcommand[MessageSend, Message]):
    """`journal message send "<text>"`: writes a message as the caller; messages have no make subcommand."""

    cli_name = "message"
    name = "send"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> MessageSend:
        return MessageSend(arguments.text)
