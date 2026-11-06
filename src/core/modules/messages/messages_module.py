from core.base.viewer.key_loading import KeyLoading
from core.base.viewer.window_key import WindowKey
from core.modules.messages.migrations.m015_main_message_targets import MainMessageTargetsMigration
from core.modules.messages.migrations.m016_message_session import MessageSessionMigration
from core.modules.messages.migrations.m013_visible_message_index import VisibleMessageIndexMigration
from core.modules.messages.migrations.m012_message_reply_index import MessageReplyIndexMigration
from core.base.viewer.window_priority import WindowPriority
from core.base.viewer.window_read_search import WindowReadSearch
from core.modules.messages.listeners.read_message_line_listener import ReadMessageLineListener
from core.modules.messages.listeners.waiting_message_typing_listener import WaitingMessageTypingListener
from core.modules.messages.migrations.m009_message_recipient import MessageRecipientMigration
from core.modules.messages.migrations.m010_message_hook_indexes import MessageHookIndexesMigration
from core.modules.messages.migrations.m011_message_visibility import MessageVisibilityMigration
from core.modules.messages.migrations.m014_message_target import MessageTargetMigration
from core.modules.messages.rules.reply_note_rule import ReplyNoteRule
from core.modules.messages.commands.record_parent_report.record_parent_report_handler import RecordParentReportHandler
from core.modules.messages.commands.record_peer_message.record_peer_message_handler import RecordPeerMessageHandler
from core.modules.messages.commands.reset_message_deliveries.reset_message_deliveries_handler import ResetMessageDeliveriesHandler
from core.modules.messages.rules.tool_message_rule import ToolMessageRule
from core.modules.messages.rules.transcript_message_rule import TranscriptMessageRule
from core.modules.messages.rules.typed_prompt_rule import TypedPromptRule
from core.modules.messages.commands.record_typed_prompt.record_typed_prompt_handler import RecordTypedPromptHandler
from core.modules.messages.migrations.m008_message_peer import MessagePeerMigration
from core.modules.messages.rules.peer_message_rule import PeerMessageRule
from core.modules.messages.commands.record_message_updated_line.record_message_updated_line_handler import RecordMessageUpdatedLineHandler
from core.modules.messages.listeners.message_edited_mark_listener import MessageEditedMarkListener
from core.modules.messages.listeners.read_message_edit_listener import ReadMessageEditListener
from core.modules.messages.support.message_nudges import MESSAGE_NUDGES
from core.modules.messages.guards.one_reply_per_message_guard import OneReplyPerMessageGuard
from core.modules.messages.guards.question_message_guard import QuestionMessageGuard
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
from core.modules.messages.commands.unread_reports.unread_reports_subcommand import UnreadReportsSubcommand
from core.modules.messages.commands.agent_reports_subcommand import AgentReportsSubcommand
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
from core.modules.messages.listeners.message_rows_listener import MessageRowsListener
from core.modules.environments.support.environment_activity import EnvironmentActivity
from core.modules.messages.bindings.message_environment_activity import MessageEnvironmentActivity
from core.modules.messages.migrations.m001_messages import MessagesTableMigration
from core.modules.messages.migrations.m002_message_files import MessageFilesMigration
from core.modules.messages.migrations.m003_message_delivery import MessageDeliveryMigration
from core.modules.messages.migrations.m004_message_delivered_at import MessageDeliveredColumnMigration
from core.modules.messages.migrations.m017_message_type_indexes import MessageTypeIndexesMigration
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
from core.base.module.model_declaration import ALL_SUBCOMMANDS
from core.modules.messages.models.message_work_source import MessageWorkSource
from core.modules.messages.migrations.m018_message_work_sources import MessageWorkSourcesMigration
from core.modules.messages.commands.choose_work_source.choose_work_source_handler import ChooseWorkSourceHandler
from core.modules.messages.commands.choose_work_source.choose_work_source_subcommand import ChooseWorkSourceSubcommand
from core.modules.messages.commands.clear_work_source.clear_work_source_handler import ClearWorkSourceHandler
from core.modules.messages.commands.clear_work_source.clear_work_source_subcommand import ClearWorkSourceSubcommand
from core.modules.messages.commands.read_message.note_message_read_handler import NoteMessageReadHandler
from core.modules.messages.listeners.deleted_work_source_listener import DeletedWorkSourceListener
from core.modules.messages.listeners.deleted_agent_work_source_listener import DeletedAgentWorkSourceListener
from core.modules.messages.commands.work_source.work_source_subcommand import WorkSourceSubcommand
from core.modules.messages.migrations.m019_work_source_selections import WorkSourceSelectionsMigration


class MessagesModule(Module):
    """Adds messages: what the user, the agents and the journal say in an environment's chat."""

    name = "journal.core.messages"
    nudges = MESSAGE_NUDGES
    requires_core = ">=5,<6"
    block_conditions = [MessagesRead, MessagesAnswered]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.chat", "journal.core.docking", "journal.core.pins", "journal.core.drivers", "journal.core.dumps"]
    models = [ModelDeclaration(Message, query=MessageQuery, excluded_subcommands=["make"]), ModelDeclaration(MessageWorkSource, excluded_subcommands=ALL_SUBCOMMANDS)]
    bindings = {EnvironmentActivity: MessageEnvironmentActivity}
    moves = [MessagesMove]
    views = [AttachedFile, ChatMessage, MainChatMark]
    migrations = [MainMessageTargetsMigration, MessageSessionMigration, MessageTargetMigration, VisibleMessageIndexMigration, MessageReplyIndexMigration, MessagesTableMigration, MessageFilesMigration, MessageDeliveryMigration, MessageDeliveredColumnMigration, MessageCaptionsMigration, MessageReactionsMigration, MessageFlowchartMigration, MessagePeerMigration, MessageRecipientMigration, MessageHookIndexesMigration, MessageVisibilityMigration, MessageTypeIndexesMigration, MessageWorkSourcesMigration, WorkSourceSelectionsMigration]
    guards = [OneReplyPerMessageGuard, QuestionMessageGuard]
    handlers = [RecordTypedPromptHandler, ResetMessageDeliveriesHandler, RecordParentReportHandler, RecordPeerMessageHandler, RecordMessageUpdatedLineHandler, DrawFlowchartHandler, ReactMessageHandler, SendMessageHandler, ReadMessageHandler, RecordMessageDeliveryHandler, TagMessageHandler, RecordWaitingMessageLineHandler, ChooseWorkSourceHandler, ClearWorkSourceHandler, NoteMessageReadHandler]
    driver_rules = [WaitingMessageTickRule, MessageDeliveryRule, UnreadMessageShowRule, MessageReadRule, UnreadMessageStopRule, AgentTextRule, ToolMessageRule, TranscriptMessageRule, TypedPromptRule, UnansweredMessageRule, UnreadMessageWriteRule, ChatMannersRule, ChatOpeningRule, PlainCodeRule, PeerMessageRule, ReplyNoteRule]
    subcommands = [AgentReportsSubcommand, UnreadReportsSubcommand, AttachmentListSubcommand, CommentMessageSubcommand, DrawFlowchartSubcommand, ReactMessageSubcommand, SendMessageSubcommand, ReplyMessageSubcommand, ReadMessageSubcommand, UnreadMessagesSubcommand, TagMessageSubcommand, MainChatRowsSubcommand, ChatMessagesSubcommand, ChooseWorkSourceSubcommand, ClearWorkSourceSubcommand, WorkSourceSubcommand]
    windows = [WindowDeclaration("messages.attachments", "Attachments", "attachments.js", WindowLoading.COMPONENT, skeleton=MESSAGES_ATTACHMENTS_SKELETON, group="project", icon=WindowIcon.FILE, reads=["attachment list"], search=WindowReadSearch("attachment list", "Search file names and their messages", ("name", "message_text"))),
               WindowDeclaration("messages.chat", "Chat", "chat.js", WindowLoading.COMPONENT, request_priority=WindowPriority.FIRST, skeleton=MESSAGES_CHAT_SKELETON, icon=WindowIcon.SPEECH, reads=["question show", "link list", "task show", "message feed", "message show", "chat-mark main", "chat-mark show", "dock-item main", "dock-item read", "process card", "pin list", "agent main", "usage tool", "hook-call feed", "output peek", "output page", "output list", "process-part list", "setting show"], runs=["message send", "message reply", "message comment", "message react", "message edit", "message delete", "link remove", "pin close", "agent type", "dump make", "dock remove", "dock keep", "dock unkeep", "developer record-mark-motion"],
                                 events=["message.*", "chat_mark.*", "dock_item.*", "pin.*", "hook_call.*", "process_part.*", "setting.*"],
                                 keys=[WindowKey("messages", "message feed", events=["message.*"], arguments=["limit", "before-id", "after-id", "ids"], page_size=50),
                                       WindowKey("marks", "chat-mark main", events=["chat_mark.*"], arguments=["limit", "before-id", "after-id", "ids"], page_size=50),
                                       WindowKey("docks", "dock-item main", events=["dock_item.*"]),
                                       WindowKey("pins", "pin list", events=["pin.*"]),
                                       WindowKey("mark-motion", "setting show journal.core.developer.tools.mark-motion", events=["setting.*"]),
                                       WindowKey("voice-profile", "setting show journal.core.voices.profile", events=["setting.*"]),
                                       WindowKey("voice-avatar", "setting show journal.core.voices.avatar", events=["setting.*"]),
                                       WindowKey("voice-avatar-shown", "setting show journal.core.voices.avatar-shown", events=["setting.*"]),
                                       WindowKey("tool", "usage tool", loading=KeyLoading.AFTER_WINDOW),
                                       WindowKey("main-agent", "agent main", loading=KeyLoading.REQUESTED),
                                       WindowKey("dock.*", "dock-item read {id}", answered_line=True),
                                       WindowKey("output.*", "output page {id}", arguments=["after", "before"]),
                                       WindowKey("run.*", "process card {id}"),
                                       WindowKey("question.*", "question show {id}")],
                                 options=[ChoiceOption("figure", "Figure", [("voice", "The voice I chose"), ("none", "None"), ("butler", "Butler"), ("homie", "Homie"), ("coach", "Coach"), ("colleague", "Colleague"), ("squire", "Squire")], "voice"),
                                          ToggleOption("floors", "Show floors")])]
    marks = MESSAGE_MARKS
    skills = [SkillDeclaration("journal-flowcharts", "Draw a flowchart in the chat, and know when one fits; load it when the user asks for a flowchart or a diagram, or a process with branches is easier to see than to read.",
                               keywords=("flowchart", "flow chart", "diagram")),
              SkillDeclaration("journal-messages", "Read and answer the user's messages and ask the user questions; read it before the first message command of a session.",
                               keywords=("message", "reply", "question"), commands=("message", "question"))]
    listeners = [MessageRowsListener, MessageEditedMarkListener, ReadMessageEditListener, WaitingMessageListener, WaitingMessageTypingListener, ReadMessageLineListener, AllowedStopListener, DeletedWorkSourceListener, DeletedAgentWorkSourceListener]
    seeders = [MessagesSeeder]
