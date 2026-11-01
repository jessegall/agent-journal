from core.modules.messages.guards.one_reply_per_message_guard import OneReplyPerMessageGuard
from core.modules.messages.commands.read_message.read_message_handler import ReadMessageHandler
from core.modules.messages.commands.record_message_delivery.record_message_delivery_handler import RecordMessageDeliveryHandler
from core.modules.messages.commands.send_message.send_message_handler import SendMessageHandler
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.migrations.m001_messages import MessagesTableMigration
from core.modules.messages.migrations.m002_message_files import MessageFilesMigration
from core.modules.messages.migrations.m003_message_delivery import MessageDeliveryMigration
from core.modules.messages.migrations.m004_message_delivered_at import MessageDeliveredAtMigration
from core.modules.messages.rules.agent_text_rule import AgentTextRule
from core.modules.messages.rules.message_delivery_rule import MessageDeliveryRule
from core.modules.messages.rules.message_show_read_rule import MessageShowReadRule
from core.modules.messages.rules.unread_message_stop_rule import UnreadMessageStopRule
from core.modules.messages.commands.reply_message.reply_message_subcommand import ReplyMessageSubcommand
from core.modules.messages.commands.send_message.send_message_subcommand import SendMessageSubcommand
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.module.model_declaration import ModelDeclaration
from core.modules.messages.models.message import Message
from core.modules.messages.upgrade.messages_move import MessagesMove
from core.modules.messages.support.message_marks import MESSAGE_MARKS
from core.modules.messages.seeders.messages_seeder import MessagesSeeder


class MessagesModule(Module):
    """Adds messages: what the user, the agents and the journal say in an environment's chat."""

    name = "journal.core.messages"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.chat", "journal.core.docking", "journal.core.notices", "journal.core.drivers", "journal.core.dumps"]
    models = [ModelDeclaration(Message, query=MessageQuery, excluded_subcommands=["make"])]
    moves = [MessagesMove]
    migrations = [MessagesTableMigration, MessageFilesMigration, MessageDeliveryMigration, MessageDeliveredAtMigration]
    guards = [OneReplyPerMessageGuard]
    handlers = (SendMessageHandler, ReadMessageHandler, RecordMessageDeliveryHandler)
    driver_rules = [MessageDeliveryRule, MessageShowReadRule, UnreadMessageStopRule, AgentTextRule]
    subcommands = (SendMessageSubcommand, ReplyMessageSubcommand,)
    windows = [WindowDeclaration("messages.chat", "Chat", "chat.js", WindowLoading.COMPONENT, icon=WindowIcon.SPEECH, reads=["message list", "message show", "chat-mark list", "chat-mark show", "dock-item list", "notice list", "usage tool", "hook-call list"], runs=["message send", "message reply", "message edit", "message delete", "notice close", "dump make"],
                                 events=["message.*", "chat_mark.*", "dock_item.*", "notice.*", "hook_call.*"])]
    marks = MESSAGE_MARKS
    listeners = []
    seeders = [MessagesSeeder]
