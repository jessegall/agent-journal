from argparse import ArgumentParser, Namespace
from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.messages.commands.send_message import SendMessage
from core.modules.messages.models.message import Message


class SendMessageSubcommand(Subcommand[SendMessage, Message]):
    """`journal message send "<text>"`: writes a message as the caller; messages have no make subcommand."""

    cli_name = "message"
    name = "send"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> SendMessage:
        return SendMessage(arguments.text)
