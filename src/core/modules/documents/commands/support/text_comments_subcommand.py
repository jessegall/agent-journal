from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.commands.support.row_comments import RowComments
from core.modules.documents.commands.support.text_comments import TextComments
from core.modules.documents.models.text_row import TextRow
from core.modules.plans.models.plan import Plan
from core.modules.tasks.models.task import Task


class TextCommentsSubcommand(ReadSubcommand[TextComments]):
    """`journal <doc, report, plan or task> comments <n>`: the messages the user wrote on it, oldest first."""

    model: ClassVar[type[TextRow] | type[Plan] | type[Task]]
    name = "comments"

    def __init__(self, queries: Queries, comments: RowComments) -> None:
        self.queries, self.comments = queries, comments

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> TextComments:
        text_row = self.queries.query(self.model).find(arguments.id)
        return TextComments(self.model.cli_name, arguments.id, self.comments.on(text_row))

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, TextComments):
            return
        if not value.messages:
            output.line(f"no comments on {value.cli_name} {value.row_id}")
            return
        output.write("\n".join(f"message {message.id}: {message.text}" for message in value.messages), {"rows": [output.values(message) for message in value.messages]})
