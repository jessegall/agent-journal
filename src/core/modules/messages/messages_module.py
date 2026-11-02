from core.modules.messages.commands.tell_message_updated.tell_message_updated_handler import TellMessageUpdatedHandler
from core.modules.messages.listeners.read_message_edit_listener import ReadMessageEditListener
from core.modules.messages.support.message_nudges import MESSAGE_NUDGES
from core.modules.messages.guards.one_reply_per_message_guard import OneReplyPerMessageGuard
from core.modules.messages.commands.read_message.read_message_handler import ReadMessageHandler
from core.modules.messages.commands.read_message.read_message_subcommand import ReadMessageSubcommand
from core.modules.messages.migrations.m006_message_reactions import MessageReactionsMigration
from core.modules.messages.migrations.m007_message_flowchart import MessageFlowchartMigration
from core.modules.messages.migrations.m005_message_captions import MessageCaptionsMigration
from core.modules.messages.commands.main_chat_rows.main_chat_rows_subcommand import MainChatRowsSubcommand
from core.modules.messages.commands.chat_messages.chat_messages_subcommand import ChatMessagesSubcommand
from core.modules.messages.models.attached_file import AttachedFile
from core.modules.messages.models.chat_message import ChatMessage
from core.modules.messages.models.main_chat_mark import MainChatMark
from core.modules.messages.commands.tag_message.tag_message_handler import TagMessageHandler
from core.modules.messages.commands.tag_message.tag_message_subcommand import TagMessageSubcommand
from core.modules.messages.commands.unread_messages.unread_messages_subcommand import UnreadMessagesSubcommand
from core.modules.messages.commands.record_message_delivery.record_message_delivery_handler import RecordMessageDeliveryHandler
from core.modules.messages.commands.attachment_list.attachment_list_subcommand import AttachmentListSubcommand
from core.modules.messages.commands.draw_flowchart.draw_flowchart_handler import DrawFlowchartHandler
from core.modules.messages.commands.draw_flowchart.draw_flowchart_subcommand import DrawFlowchartSubcommand
from core.modules.messages.commands.react_message.react_message_handler import ReactMessageHandler
from core.modules.messages.commands.react_message.react_message_subcommand import ReactMessageSubcommand
from core.modules.messages.commands.send_message.send_message_handler import SendMessageHandler
from core.modules.messages.commands.tell_idle_agent.tell_idle_agent_handler import TellIdleAgentHandler
from core.modules.messages.listeners.allowed_stop_listener import AllowedStopListener
from core.modules.messages.listeners.idle_message_listener import IdleMessageListener
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.migrations.m001_messages import MessagesTableMigration
from core.modules.messages.migrations.m002_message_files import MessageFilesMigration
from core.modules.messages.migrations.m003_message_delivery import MessageDeliveryMigration
from core.modules.messages.migrations.m004_message_delivered_at import MessageDeliveredColumnMigration
from core.modules.messages.rules.agent_text_rule import AgentTextRule
from core.modules.messages.rules.message_delivery_rule import MessageDeliveryRule
from core.modules.messages.rules.message_read_rule import MessageReadRule
from core.modules.messages.rules.unread_message_show_rule import UnreadMessageShowRule
from core.modules.messages.rules.chat_manners_rule import ChatMannersRule
from core.modules.messages.rules.chat_opening_rule import ChatOpeningRule
from core.modules.messages.rules.plain_code_rule import PlainCodeRule
from core.modules.messages.rules.unanswered_message_rule import UnansweredMessageRule
from core.modules.messages.rules.unread_message_stop_rule import UnreadMessageStopRule
from core.modules.messages.rules.unread_message_write_rule import UnreadMessageWriteRule
from core.modules.messages.commands.reply_message.reply_message_subcommand import ReplyMessageSubcommand
from core.modules.messages.commands.send_message.send_message_subcommand import SendMessageSubcommand
from core.base.module.module import Module
from core.base.skill.skill_declaration import SkillDeclaration
from core.base.viewer.choice_option import ChoiceOption
from core.base.viewer.toggle_option import ToggleOption
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
    nudges = MESSAGE_NUDGES
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.chat", "journal.core.docking", "journal.core.notices", "journal.core.drivers", "journal.core.dumps"]
    models = [ModelDeclaration(Message, query=MessageQuery, excluded_subcommands=["make"])]
    moves = [MessagesMove]
    views = [AttachedFile, ChatMessage, MainChatMark]
    migrations = [MessagesTableMigration, MessageFilesMigration, MessageDeliveryMigration, MessageDeliveredColumnMigration, MessageCaptionsMigration, MessageReactionsMigration, MessageFlowchartMigration]
    guards = [OneReplyPerMessageGuard]
    handlers = (TellMessageUpdatedHandler, DrawFlowchartHandler, ReactMessageHandler, SendMessageHandler, ReadMessageHandler, RecordMessageDeliveryHandler, TagMessageHandler, TellIdleAgentHandler)
    driver_rules = [MessageDeliveryRule, UnreadMessageShowRule, MessageReadRule, UnreadMessageStopRule, AgentTextRule, UnansweredMessageRule, UnreadMessageWriteRule, ChatMannersRule, ChatOpeningRule, PlainCodeRule]
    subcommands = (AttachmentListSubcommand, DrawFlowchartSubcommand, ReactMessageSubcommand, SendMessageSubcommand, ReplyMessageSubcommand, ReadMessageSubcommand, UnreadMessagesSubcommand, TagMessageSubcommand, MainChatRowsSubcommand, ChatMessagesSubcommand)
    windows = [WindowDeclaration("messages.attachments", "Attachments", "attachments.js", WindowLoading.COMPONENT, group="project", icon=WindowIcon.FILE, reads=["attachment list"]),
               WindowDeclaration("messages.chat", "Chat", "chat.js", WindowLoading.COMPONENT, icon=WindowIcon.SPEECH, reads=["link list", "message feed", "message show", "chat-mark main", "chat-mark show", "dock-item list", "notice list", "usage tool", "hook-call feed", "output peek"], runs=["message send", "message reply", "message react", "message edit", "message delete", "notice close", "dump make"],
                                 events=["message.*", "chat_mark.*", "dock_item.*", "notice.*", "hook_call.*"],
                                 options=[ChoiceOption("figure", "Figure", [("none", "None"), ("butler", "Butler"), ("homie", "Homie"), ("coach", "Coach"), ("colleague", "Colleague"), ("squire", "Squire")], "none"),
                                          ToggleOption("floors", "Show floors")])]
    marks = MESSAGE_MARKS
    skills = [SkillDeclaration("journal-flowcharts", "Draw a flowchart in the chat, and know when one fits; load it when the user asks for a flowchart or a diagram, or a process with branches is easier to see than to read.",
                               keywords=("flowchart", "flow chart", "diagram"), commands=tuple(["message"]))]
    listeners = [ReadMessageEditListener, IdleMessageListener, AllowedStopListener]
    seeders = [MessagesSeeder]
