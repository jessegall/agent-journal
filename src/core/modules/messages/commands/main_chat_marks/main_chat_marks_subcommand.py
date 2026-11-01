from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.less import Less
from core.base.page import Page
from core.base.query.queries import Queries
from core.base.query.query import PAGE_SIZE_ROWS
from core.base.refusal import Refusal
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.messages.support.main_agent_mark import MainAgentMark


class MainChatMarksSubcommand(ReadSubcommand[Page[ChatMark]]):
    """`journal chat-mark main`: the marks the main chat shows, newest first, a page at a time."""

    cli_name = "chat-mark"
    name = "main"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)
        parser.add_argument("--after-id", type=int, default=None)
        parser.add_argument("--before-id", type=int, default=None)

    def read(self, arguments: Namespace, caller: Caller) -> Page[ChatMark]:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the main chat is shown for one environment", "name it with --environment")
        marks = self.queries.query(ChatMark).filter(environment_id=environment_id).matching(MainAgentMark())
        if arguments.after_id is not None:
            marks = marks.matching(Greater("id", arguments.after_id))
        if arguments.before_id is not None:
            marks = marks.matching(Less("id", arguments.before_id))
        return marks.newest().page(1, arguments.limit)
