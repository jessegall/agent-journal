from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.change.event_log import EventLog
from core.base.cli.row_links import RowLinks
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.subcommand.subcommand import Subcommand
from core.base.subcommand.output import Output
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_text import MessageText

MESSAGES_TABLE = "messages"
MESSAGE_DELETED = "message.delete"


class ReadMessageSubcommand(Subcommand[ReadMessage, Message]):
    """Reads a message and selects the first addressed request before returning its text and links."""

    cli_name = "message"
    name = "read"
    help = "Read and mark a message now. Select the first addressed request only when no request is active."

    def __init__(self, queries: Queries, links: RowLinks, events: EventLog) -> None:
        self.queries, self.links, self.events = queries, links, events

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("message_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ReadMessage:
        if not self.queries.query(Message).filter(id=arguments.message_id).exists() and self.was_deleted(arguments.message_id):
            raise Refusal(f"the user deleted message {arguments.message_id}, so there is nothing to read", "go on with your work")
        return ReadMessage(arguments.message_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Message):
            text = MessageText.built(value, self.links)
            output.write("\n".join(text.lines()), text.json())

    def was_deleted(self, message_id: int) -> bool:
        return any(event.event == MESSAGE_DELETED for event in self.events.row_events(MESSAGES_TABLE, message_id))
