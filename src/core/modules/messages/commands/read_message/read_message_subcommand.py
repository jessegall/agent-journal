from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.change.event_log import EventLog
from core.base.cli.row_links import RowLinks
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_text import MessageText

MESSAGES_TABLE = "messages"
MESSAGE_DELETED = "message.delete"


class ReadMessageSubcommand(ReadSubcommand[MessageText]):
    """`journal message read <n>`: only a message's text and links; the messages module marks it read once
    this ran. A message the user deleted says so, since there is nothing left to read."""

    cli_name = "message"
    name = "read"

    def __init__(self, queries: Queries, links: RowLinks, events: EventLog) -> None:
        self.queries, self.links, self.events = queries, links, events

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("message_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> MessageText:
        if not self.queries.query(Message).filter(id=arguments.message_id).exists() and self.was_deleted(arguments.message_id):
            raise Refusal(f"the user deleted message {arguments.message_id}, so there is nothing to read", "go on with your work")
        return MessageText.built(self.queries.query(Message).find(arguments.message_id), self.links)

    def was_deleted(self, message_id: int) -> bool:
        return any(event.event == MESSAGE_DELETED for event in self.events.row_events(MESSAGES_TABLE, message_id))
