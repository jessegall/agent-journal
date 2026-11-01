from core.base.cli.view_rows_subcommand import ViewRowsSubcommand
from core.modules.messages.models.chat_message import ChatMessage


class ChatMessagesSubcommand(ViewRowsSubcommand):
    """`journal message feed [--environment-id <n>] [--before-id <n>] [--after-id <n>]`: a page of the chat's messages,
    newest first, with the fields the chat draws."""

    cli_name = "message"
    name = "feed"
    model = ChatMessage
    filters = ("environment_id",)
