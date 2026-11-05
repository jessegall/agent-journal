from argparse import ArgumentParser, Namespace
from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.models.message import Message


class SendMessageSubcommand(Subcommand[SendMessage, Message]):
    """`journal message send "<text>"`: writes a message as the caller; messages have no make subcommand."""

    cli_name = "message"
    name = "send"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")
        parser.add_argument("--file", action="append", default=[], dest="files")
        parser.add_argument("--target-agent", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> SendMessage:
        return SendMessage(arguments.text, files=tuple(arguments.files), target_agent_id=arguments.target_agent)
