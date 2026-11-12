from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.number_list import number_list
from engine.cli.view_row_page import ViewRowPage
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.conditions.less import Less
from engine.query.queries import Queries
from engine.query.query import PAGE_SIZE_ROWS
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.messages.models.main_chat_mark import MainChatMark


class MainChatRowsSubcommand(ReadSubcommand[ViewRowPage]):
    """Lists main-chat marks, newest first, with an optional type filter."""

    cli_name = "chat-mark"
    name = "main"
    environment_refusal = "the main chat is shown for one environment"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--type", default="")
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)
        parser.add_argument("--after-id", type=int, default=None)
        parser.add_argument("--before-id", type=int, default=None)
        parser.add_argument("--ids", type=number_list, default=None)

    def read(self, arguments: Namespace, caller: Caller) -> ViewRowPage:
        marks = self.queries.query(MainChatMark)
        if arguments.type:
            marks = marks.filter(type=arguments.type)
        if arguments.after_id is not None:
            marks = marks.matching(Greater("id", arguments.after_id))
        if arguments.before_id is not None:
            marks = marks.matching(Less("id", arguments.before_id))
        if arguments.ids is not None:
            marks = marks.matching(Among("id", arguments.ids))
        return ViewRowPage(tuple(marks.newest().limit(arguments.limit).get()))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ViewRowPage):
            output.write("\n".join(f"{row.id}  {row.type}  {row.text}" for row in value.rows if isinstance(row, MainChatMark)) or "nothing found", value.json())
