from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.messages.commands.tag_message.tag_message import TagMessage
from core.modules.messages.models.message import Message


class TagMessageSubcommand(Subcommand[TagMessage, Message]):
    """`journal message tag <n> "<file>" "<what it shows>"`: says what an attached picture shows, so it can be
    found later."""

    cli_name = "message"
    name = "tag"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("message_id", type=int)
        parser.add_argument("file")
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> TagMessage:
        return TagMessage(arguments.message_id, arguments.file, arguments.text)
