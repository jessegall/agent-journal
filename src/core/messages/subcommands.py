from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.messages.commands import MessageRead, MessageSend
from core.messages.message import Message


class MessageSendSubcommand(Subcommand[MessageSend, Message]):
    """`journal message send "<text>"`: writes a message as the caller; messages have no make subcommand."""

    cli_noun = "message"
    name = "send"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> MessageSend:
        return MessageSend(arguments.text)


class MessageReplySubcommand(Subcommand[MessageSend, Message]):
    """`journal message reply <message> "<text>"`: writes a message that answers another."""

    cli_noun = "message"
    name = "reply"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("parent_id", type=int)
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> MessageSend:
        return MessageSend(arguments.text, arguments.parent_id)


class MessageReadSubcommand(Subcommand[MessageRead, Message]):
    """`journal message read <message>`: marks a message read."""

    cli_noun = "message"
    name = "read"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("message_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> MessageRead:
        return MessageRead(arguments.message_id)
