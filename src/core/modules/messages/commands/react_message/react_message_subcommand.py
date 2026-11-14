from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.messages.commands.react_message.react_message import ReactMessage
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_reactions import MessageReactions


class ReactMessageSubcommand(Subcommand[ReactMessage, Message]):
    """`journal message react <n> "<emoji>"`: puts a face on a message; the same face again takes it off."""

    cli_name = "message"
    name = "react"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("message_id", type=int)
        parser.add_argument("emoji")

    def command(self, arguments: Namespace, caller: Caller) -> ReactMessage:
        return ReactMessage(arguments.message_id, arguments.emoji)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Message):
            emoji = " ".join(str(reaction["emoji"]) for reaction in MessageReactions.decoded(value))
            output.line(f"message {value.id}: {emoji or 'no emoji'}")
