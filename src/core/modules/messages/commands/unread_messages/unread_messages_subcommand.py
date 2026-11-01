from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.cli.row_links import RowLinks
from core.base.environment_names import EnvironmentNames
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_text import MessageText


class UnreadMessagesSubcommand(ReadSubcommand[tuple[MessageText, ...]]):
    """`journal message unread`: every unread message of the person, oldest first, as message read shows each; the messages module marks them read once this ran."""

    cli_name = "message"
    name = "unread"

    def __init__(self, queries: Queries, links: RowLinks, environment_names: EnvironmentNames) -> None:
        self.queries, self.links, self.environment_names = queries, links, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[MessageText, ...]:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("unread messages are read for one environment", "name it with --environment")
        unread = self.queries.query(Message).filter(environment_id=environment_id, type=MessageType.USER).matching(IsNull("read_at")).oldest().all_rows()
        return tuple(MessageText.of(message, self.links) for message in unread)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, tuple):
            blocks = ["\n".join((f"message {text.id}:", *text.lines())) for text in value if isinstance(text, MessageText)]
            output.write("\n\n".join(blocks) or "no unread messages", {"messages": [text.json() for text in value if isinstance(text, MessageText)]})
