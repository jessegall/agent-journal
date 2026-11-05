from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.cli.view_row_page import ViewRowPage
from core.base.environment_names import EnvironmentNames
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.less import Less
from core.base.query.queries import Queries
from core.base.query.query import PAGE_SIZE_ROWS
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.messages.models.main_chat_mark import MainChatMark


class MainChatRowsSubcommand(ReadSubcommand[ViewRowPage]):
    """Lists main-chat marks, newest first, with an optional type filter."""

    cli_name = "chat-mark"
    name = "main"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--type", default="")
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)
        parser.add_argument("--after-id", type=int, default=None)
        parser.add_argument("--before-id", type=int, default=None)

    def read(self, arguments: Namespace, caller: Caller) -> ViewRowPage:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the main chat is shown for one environment", "name it with --environment")
        marks = self.queries.query(MainChatMark).filter(environment_id=environment_id)
        if arguments.type:
            marks = marks.filter(type=arguments.type)
        if arguments.after_id is not None:
            marks = marks.matching(Greater("id", arguments.after_id))
        if arguments.before_id is not None:
            marks = marks.matching(Less("id", arguments.before_id))
        return ViewRowPage(tuple(marks.newest().limited(arguments.limit)))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ViewRowPage):
            output.write("\n".join(f"{row.id}  {row.type}  {row.text}" for row in value.rows if isinstance(row, MainChatMark)) or "nothing found", value.json())
