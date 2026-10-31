from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.commands.support.text_comments import TextComments
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.models.text_row import TextRow
from core.modules.messages.models.message import Message

MESSAGE_MODEL = "message"


class TextCommentsSubcommand(ReadSubcommand[TextComments]):
    """`journal <doc or report> comments <n>`: the messages the user wrote on it, oldest first."""

    model: ClassVar[type[TextRow]]
    name = "comments"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> TextComments:
        text_row = self.queries.query(self.model).find(arguments.id)
        links = self.queries.query(Link).filter(target_model=text_row.model_name, target_id=text_row.id, link_type=LinkType.COMMENT, source_model=MESSAGE_MODEL).oldest()
        return TextComments(self.model.cli_name, arguments.id, tuple(self.queries.query(Message).find_many([link.source_id for link in links.all_rows()])))

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, TextComments):
            return
        if not value.messages:
            output.line(f"no comments on {value.cli_name} {value.row_id}")
            return
        output.write("\n".join(f"message {message.id}: {message.text}" for message in value.messages), {"rows": [output.values(message) for message in value.messages]})
