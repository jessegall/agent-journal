from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.cli.row_links import RowLinks
from core.base.query.conditions.is_null import IsNull
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.base.query.conditions.among import Among
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.support.message_text import MessageText
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.conditions.main_message_target import MainMessageTarget


class UnreadMessagesSubcommand(ReadSubcommand[tuple[MessageText, ...]]):
    """Shows the caller's unread messages, oldest first, or the main chat's messages for a person."""

    cli_name = "message"
    name = "unread"
    help = "Show unread messages without choosing or replacing a work source."
    environment_refusal = "unread messages are read for one environment"

    def __init__(self, links: RowLinks, messages: MessageQuery) -> None:
        self.links = links
        self.messages = messages

    def read(self, arguments: Namespace, caller: Caller) -> tuple[MessageText, ...]:
        agent_id = caller.read_actor_id
        addressed = self.messages.unread(agent_id) if agent_id is not None else self.messages.matching(MainMessageTarget()).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at"))
        unread = addressed.oldest().all_rows()
        return tuple(MessageText.built(message, self.links) for message in unread)

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            blocks = ["\n".join((f"message {text.id}:", *text.lines())) for text in value if isinstance(text, MessageText)]
            output.write("\n\n".join(blocks) or "no unread messages", {"messages": [text.json() for text in value if isinstance(text, MessageText)]})
