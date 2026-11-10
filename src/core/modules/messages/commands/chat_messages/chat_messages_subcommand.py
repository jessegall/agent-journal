from engine.cli.view_rows_subcommand import ViewRowsSubcommand
from core.modules.messages.models.chat_message import ChatMessage
from argparse import Namespace
from engine.model.view_model import ViewModel
from engine.query.query import Query
from core.modules.messages.conditions.main_message_target import MainMessageTarget


class ChatMessagesSubcommand(ViewRowsSubcommand):
    """`journal message feed [--before-id <n>] [--after-id <n>]`: a page of the chat's
    messages,
    newest first, with the fields the chat draws."""

    model = ChatMessage
    filters = ["target_agent_id"]
    cli_name = "message"
    name = "feed"
    outward = True

    def filtered(self, query: Query[ViewModel], arguments: Namespace) -> Query[ViewModel]:
        return query.matching(MainMessageTarget()) if arguments.target_agent_id is None else query
