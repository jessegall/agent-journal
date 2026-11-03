from core.modules.messages.listeners.read_message_line_listener import ReadMessageLineListener
from core.modules.messages.listeners.waiting_message_typing_listener import WaitingMessageTypingListener
from core.modules.messages.migrations.m009_message_recipient import MessageRecipientMigration
from core.modules.messages.migrations.m010_message_hook_indexes import MessageHookIndexesMigration
from core.modules.messages.rules.reply_note_rule import ReplyNoteRule
from core.modules.messages.commands.record_peer_message.record_peer_message_handler import RecordPeerMessageHandler
from core.modules.messages.migrations.m008_message_peer import MessagePeerMigration
from core.modules.messages.rules.peer_message_rule import PeerMessageRule
from core.modules.messages.commands.record_message_updated_line.record_message_updated_line_handler import RecordMessageUpdatedLineHandler
from core.modules.messages.listeners.message_edited_mark_listener import MessageEditedMarkListener
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
from core.modules.messages.commands.comment_message.comment_message_subcommand import CommentMessageSubcommand
from core.modules.messages.commands.draw_flowchart.draw_flowchart_handler import DrawFlowchartHandler
from core.modules.messages.commands.draw_flowchart.draw_flowchart_subcommand import DrawFlowchartSubcommand
from core.modules.messages.commands.react_message.react_message_handler import ReactMessageHandler
from core.modules.messages.commands.react_message.react_message_subcommand import ReactMessageSubcommand
from core.modules.messages.commands.send_message.send_message_handler import SendMessageHandler
from core.modules.messages.commands.record_waiting_message_line.record_waiting_message_line_handler import RecordWaitingMessageLineHandler
from core.modules.messages.listeners.allowed_stop_listener import AllowedStopListener
from core.modules.messages.listeners.waiting_message_listener import WaitingMessageListener
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.migrations.m001_messages import MessagesTableMigration
from core.modules.messages.migrations.m002_message_files import MessageFilesMigration
from core.modules.messages.migrations.m003_message_delivery import MessageDeliveryMigration
from core.modules.messages.migrations.m004_message_delivered_at import MessageDeliveredColumnMigration
from core.modules.messages.rules.agent_text_rule import AgentTextRule
from core.modules.messages.rules.message_delivery_rule import MessageDeliveryRule
from core.modules.messages.rules.message_read_rule import MessageReadRule
from core.modules.messages.rules.waiting_message_tick_rule import WaitingMessageTickRule
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
from core.modules.messages.support.block_conditions.messages_read import MessagesRead
from core.modules.messages.support.block_conditions.messages_answered import MessagesAnswered
from core.modules.messages.support.skeletons import MESSAGES_ATTACHMENTS_SKELETON, MESSAGES_CHAT_SKELETON


class MessagesModule(Module):
    """Adds messages: what the user, the agents and the journal say in an environment's chat."""

    name = "journal.core.messages"
    nudges = MESSAGE_NUDGES
    requires_core = ">=5,<6"
    block_conditions = [MessagesRead, MessagesAnswered]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.chat", "journal.core.docking", "journal.core.pins", "journal.core.drivers", "journal.core.dumps"]
    models = [ModelDeclaration(Message, query=MessageQuery, excluded_subcommands=["make"])]
    moves = [MessagesMove]
    views = [AttachedFile, ChatMessage, MainChatMark]
    migrations = [MessagesTableMigration, MessageFilesMigration, MessageDeliveryMigration, MessageDeliveredColumnMigration, MessageCaptionsMigration, MessageReactionsMigration, MessageFlowchartMigration, MessagePeerMigration, MessageRecipientMigration, MessageHookIndexesMigration]
    guards = [OneReplyPerMessageGuard]
    handlers = (RecordPeerMessageHandler, RecordMessageUpdatedLineHandler, DrawFlowchartHandler, ReactMessageHandler, SendMessageHandler, ReadMessageHandler, RecordMessageDeliveryHandler, TagMessageHandler, RecordWaitingMessageLineHandler)
    driver_rules = [WaitingMessageTickRule, MessageDeliveryRule, UnreadMessageShowRule, MessageReadRule, UnreadMessageStopRule, AgentTextRule, UnansweredMessageRule, UnreadMessageWriteRule, ChatMannersRule, ChatOpeningRule, PlainCodeRule, PeerMessageRule, ReplyNoteRule]
    subcommands = (AttachmentListSubcommand, CommentMessageSubcommand, DrawFlowchartSubcommand, ReactMessageSubcommand, SendMessageSubcommand, ReplyMessageSubcommand, ReadMessageSubcommand, UnreadMessagesSubcommand, TagMessageSubcommand, MainChatRowsSubcommand, ChatMessagesSubcommand)
    windows = [WindowDeclaration("messages.attachments", "Attachments", "attachments.js", WindowLoading.COMPONENT, skeleton=MESSAGES_ATTACHMENTS_SKELETON, group="project", icon=WindowIcon.FILE, reads=["attachment list"]),
               WindowDeclaration("messages.chat", "Chat", "chat.js", WindowLoading.COMPONENT, skeleton=MESSAGES_CHAT_SKELETON, icon=WindowIcon.SPEECH, reads=["question show", "link list", "message feed", "message show", "chat-mark main", "chat-mark show", "dock-item main", "pin list", "agent main", "usage tool", "hook-call feed", "output peek", "output list", "process-part list", "setting show"], runs=["message send", "message reply", "message comment", "message react", "message edit", "message delete", "pin close", "agent type", "dump make", "dock remove", "dock keep", "dock unkeep"],
                                 events=["message.*", "chat_mark.*", "dock_item.*", "pin.*", "hook_call.*", "process_part.*", "setting.*"],
                                 options=[ChoiceOption("figure", "Figure", [("voice", "The voice I chose"), ("none", "None"), ("butler", "Butler"), ("homie", "Homie"), ("coach", "Coach"), ("colleague", "Colleague"), ("squire", "Squire")], "voice"),
                                          ToggleOption("floors", "Show floors")])]
    marks = MESSAGE_MARKS
    skills = [SkillDeclaration("journal-flowcharts", "Draw a flowchart in the chat, and know when one fits; load it when the user asks for a flowchart or a diagram, or a process with branches is easier to see than to read.",
                               keywords=("flowchart", "flow chart", "diagram")),
              SkillDeclaration("journal-messages", "Read and answer the user's messages and ask the user questions; read it before the first message command of a session.",
                               keywords=("message", "reply", "question"), commands=("message", "question"))]
    listeners = [MessageEditedMarkListener, ReadMessageEditListener, WaitingMessageListener, WaitingMessageTypingListener, ReadMessageLineListener, AllowedStopListener]
    seeders = [MessagesSeeder]
