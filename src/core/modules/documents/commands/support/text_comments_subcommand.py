from argparse import ArgumentParser, Namespace
from typing import ClassVar

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.support.row_comments import RowComments
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
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--page-size", type=int, default=25)

    def read(self, arguments: Namespace, caller: Caller) -> TextComments:
        text_row = self.queries.query(self.model).find(arguments.id)
        size = min(arguments.page_size, 50)
        if arguments.page < 1 or size < 1 or arguments.page > 9223372036854775807 // size:
            raise Refusal("use a positive comment page and page size within the supported range")
        page = self.comments.page(text_row, arguments.page, size)
        next_command = None if page.is_last else f"journal {self.model.cli_name} comments {arguments.id} --page {arguments.page + 1} --page-size {size}"
        return TextComments(self.model.cli_name, arguments.id, page.rows, page.number, page.size, page.total, next_command)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, TextComments):
            return
        text = "\n".join(f"message {comment.id}: {comment.text}" for comment in value.comments) or f"no comments on {value.cli_name} {value.row_id}"
        if value.next_command is not None:
            text += f"\n{value.next_command}"
        output.write(text, {"rows": [output.values(comment) for comment in value.comments], "page": value.page,
                           "page_size": value.page_size, "total": value.total, "has_next_page": value.next_command is not None,
                           "next_page": value.page + 1 if value.next_command is not None else None, "next_command": value.next_command})
