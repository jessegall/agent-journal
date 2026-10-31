from argparse import ArgumentParser, Namespace
from collections.abc import Sequence
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.model.tables import Tables
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.commands.support.text_comments import TextComments
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.link import Link
from core.modules.documents.models.report import Report
from core.modules.messages.models.message import Message

COMMENT_LINK_TYPE = "comments_on"


class TextCommentsSubcommand(ReadSubcommand[TextComments]):
    """`journal <doc or report> comments <n>`: the messages the user wrote on it, oldest first."""

    model: ClassVar[type[Doc] | type[Report]]
    name = "comments"

    def __init__(self, queries: Queries, tables: Tables) -> None:
        self.queries, self.tables = queries, tables

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> TextComments:
        target = f"{self.tables.table(self.model).name}:{self.queries.query(self.model).find(arguments.id).id}"
        links = self.queries.query(Link).filter(target=target, link_type=COMMENT_LINK_TYPE).oldest().all_rows()
        message_ids: Sequence[int] = [int(link.source.partition(":")[2]) for link in links if link.source.startswith("messages:")]
        return TextComments(self.model.cli_name, arguments.id, tuple(self.queries.query(Message).find_many(message_ids)))

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, TextComments):
            return
        if not value.messages:
            output.line(f"no comments on {value.cli_name} {value.row_id}")
            return
        output.write("\n".join(f"message {message.id}: {message.text}" for message in value.messages), {"rows": [output.values(message) for message in value.messages]})
