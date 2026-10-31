from core.modules.messages.guards.one_reply_per_message_guard import OneReplyPerMessageGuard
from core.modules.messages.read_message_handler import ReadMessageHandler
from core.modules.messages.send_message_handler import SendMessageHandler
from core.modules.messages.message_query import MessageQuery
from core.modules.messages.migrations.m001_messages import MessagesTableMigration
from core.modules.messages.read_message_subcommand import ReadMessageSubcommand
from core.modules.messages.message_reply_subcommand import MessageReplySubcommand
from core.modules.messages.send_message_subcommand import SendMessageSubcommand
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.base.module.model_declaration import ModelDeclaration
from core.modules.messages.message import Message


class MessagesModule(Module):
    """Adds messages: what the user, the agents and the journal say in an environment's chat."""

    name = "journal.core.messages"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]
    models = [ModelDeclaration(Message, query=MessageQuery, excluded_subcommands=["make"])]
    migrations = [MessagesTableMigration]
    guards = [OneReplyPerMessageGuard]
    handlers = (SendMessageHandler, ReadMessageHandler)
    subcommands = (SendMessageSubcommand, MessageReplySubcommand, ReadMessageSubcommand,)
    windows = [WindowDeclaration("messages.chat", "Chat", "chat.js", WindowLoading.COMPONENT, reads=["message list", "message show"], runs=["message send"],
                                 events=["message.*"])]
