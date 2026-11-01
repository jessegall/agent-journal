from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.cli.row_links import RowLinks
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_text import MessageText


class ReadMessageSubcommand(ReadSubcommand[MessageText]):
    """`journal message read <n>`: only a message's text and links; the messages module marks it read once this ran."""

    cli_name = "message"
    name = "read"

    def __init__(self, queries: Queries, links: RowLinks) -> None:
        self.queries, self.links = queries, links

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("message_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> MessageText:
        return MessageText.of(self.queries.query(Message).find(arguments.message_id), self.links)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, MessageText):
            output.write("\n".join(value.lines()), value.json())
