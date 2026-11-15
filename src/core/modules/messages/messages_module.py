from core.modules.messages.listeners.message_step_listener import MessageStepListener
from core.modules.messages.needs.unread_message_needs import UnreadMessageNeeds
from core.modules.messages.needs.unanswered_message_needs import UnansweredMessageNeeds
from core.modules.messages.policies.unread_message_show_policy import UnreadMessageShowPolicy
from core.modules.messages.lines.new_message_lines import NewMessageLines
from core.modules.messages.lines.unanswered_message_lines import UnansweredMessageLines
from core.modules.messages.lines.message_read_lines import MessageReadLines
from core.modules.messages.lines.chat_manners_lines import ChatMannersLines
from core.modules.messages.lines.chat_opening_lines import ChatOpeningLines
from core.modules.messages.lines.plain_code_lines import PlainCodeLines
from core.modules.messages.lines.reply_note_lines import ReplyNoteLines
from core.modules.messages.lines.agent_text_lines import AgentTextLines
from core.modules.messages.effects.message_delivery_effect import MessageDeliveryEffect
from core.modules.messages.effects.message_read_effect import MessageReadEffect
from core.modules.messages.effects.agent_text_effect import AgentTextEffect
from core.modules.messages.effects.text_before_tool_effect import TextBeforeToolEffect
from core.modules.messages.effects.transcript_catch_up_effect import TranscriptCatchUpEffect
from core.modules.messages.effects.typed_prompt_effect import TypedPromptEffect
from core.modules.messages.effects.peer_message_effect import PeerMessageEffect
from core.modules.messages.windows.messages_windows import MESSAGES_WINDOWS
from core.modules.messages.models.declarations.message_model_declaration import MessageModelDeclaration
from core.modules.messages.models.declarations.message_work_source_model_declaration import MessageWorkSourceModelDeclaration
from core.modules.messages.skills.declarations.messages_skills import MESSAGES_SKILLS
from core.modules.messages.migrations.m023_environment_index import MessageWorkSourcesEnvironmentIndexMigration
from core.modules.messages.migrations.m020_message_parent_environment import MessageParentEnvironmentMigration
from core.modules.messages.commands.report_safeguards_stop.report_safeguards_stop_handler import ReportSafeguardsStopHandler
from core.modules.messages.migrations.m022_message_agent_text import MessageAgentTextMigration
from core.modules.messages.commands.message_conversations.message_conversations_subcommand import MessageConversationsSubcommand
from core.modules.messages.migrations.m015_main_message_targets import MainMessageTargetsMigration
from core.modules.messages.migrations.m016_message_session import MessageSessionMigration
from core.modules.messages.migrations.m013_visible_message_index import VisibleMessageIndexMigration
from core.modules.messages.migrations.m012_message_reply_index import MessageReplyIndexMigration
from core.modules.messages.listeners.read_message_line_listener import ReadMessageLineListener
from core.modules.messages.listeners.released_message_line_listener import ReleasedMessageLineListener
from core.modules.messages.listeners.waiting_message_typing_listener import WaitingMessageTypingListener
from core.modules.messages.migrations.m009_message_recipient import MessageRecipientMigration
from core.modules.messages.migrations.m010_message_hook_indexes import MessageHookIndexesMigration
from core.modules.messages.migrations.m011_message_visibility import MessageVisibilityMigration
from core.modules.messages.migrations.m014_message_target import MessageTargetMigration
from core.modules.messages.commands.record_parent_report.record_parent_report_handler import RecordParentReportHandler
from core.modules.messages.commands.record_peer_message.record_peer_message_handler import RecordPeerMessageHandler
from core.modules.messages.commands.reset_message_deliveries.reset_message_deliveries_handler import ResetMessageDeliveriesHandler
from core.modules.messages.commands.record_typed_prompt.record_typed_prompt_handler import RecordTypedPromptHandler
from core.modules.messages.migrations.m008_message_peer import MessagePeerMigration
from core.modules.messages.commands.record_message_updated_line.record_message_updated_line_handler import RecordMessageUpdatedLineHandler
from core.modules.messages.listeners.message_edited_mark_listener import MessageEditedMarkListener
from core.modules.messages.listeners.read_message_edit_listener import ReadMessageEditListener
from core.modules.messages.support.message_agent_messages import MESSAGE_AGENT_MESSAGES
from core.modules.messages.guards.one_reply_per_message_guard import OneReplyPerMessageGuard
from core.modules.messages.guards.repeated_message_guard import RepeatedMessageGuard
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
from core.modules.messages.commands.agent_reports.agent_reports_subcommand import AgentReportsSubcommand
from core.modules.messages.commands.record_message_delivery.record_message_delivery_handler import RecordMessageDeliveryHandler
from core.modules.messages.commands.attachment_list.attachment_list_subcommand import AttachmentListSubcommand
from core.modules.messages.commands.draw_flowchart.draw_flowchart_handler import DrawFlowchartHandler
from core.modules.messages.commands.draw_flowchart.draw_flowchart_subcommand import DrawFlowchartSubcommand
from core.modules.messages.commands.react_message.react_message_handler import ReactMessageHandler
from core.modules.messages.commands.react_message.react_message_subcommand import ReactMessageSubcommand
from core.modules.messages.commands.send_message.send_message_handler import SendMessageHandler
from core.modules.messages.commands.send_agent_message.send_agent_message_handler import SendAgentMessageHandler
from core.modules.messages.commands.record_waiting_message_line.record_waiting_message_line_handler import RecordWaitingMessageLineHandler
from core.modules.messages.listeners.waiting_message_listener import WaitingMessageListener
from core.modules.messages.listeners.message_rows_listener import MessageRowsListener
from core.modules.messages.listeners.tagged_image_block_listener import TaggedImageBlockListener
from core.modules.messages.listeners.report_pin_listener import ReportPinListener
from core.modules.environments.support.environment_activity import EnvironmentActivity
from core.modules.messages.bindings.message_environment_activity import MessageEnvironmentActivity
from core.modules.messages.migrations.m001_messages import MessagesTableMigration
from core.modules.messages.migrations.m002_message_files import MessageFilesMigration
from core.modules.messages.migrations.m003_message_delivery import MessageDeliveryMigration
from core.modules.messages.migrations.m004_message_delivered_at import MessageDeliveredColumnMigration
from core.modules.messages.migrations.m017_message_type_indexes import MessageTypeIndexesMigration
from core.modules.messages.commands.reply_message.reply_message_subcommand import ReplyMessageSubcommand
from core.modules.messages.commands.send_message.send_message_subcommand import SendMessageSubcommand
from engine.module.module import Module
from core.modules.messages.upgrade.messages_move import MessagesMove
from core.modules.messages.marks.message_summary_mark import MessageSummaryMark
from core.modules.messages.marks.message_filed_mark import MessageFiledMark
from core.modules.messages.marks.message_edited_mark import MessageEditedMark
from core.modules.messages.seeders.messages_seeder import MessagesSeeder
from core.modules.messages.support.block_conditions.messages_read import MessagesRead
from core.modules.messages.support.block_conditions.messages_answered import MessagesAnswered
from core.modules.messages.listeners.new_session_work_source_listener import NewSessionWorkSourceListener
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
from core.modules.messages.support.message_settings import MESSAGE_SETTINGS
from core.modules.messages.migrations.m021_message_hook_scan_indexes import MessageHookScanIndexesMigration


class MessagesModule(Module):
    """Adds messages: what the user, the agents and the journal say in an environment's chat."""

    name = "journal.core.messages"
    agent_listeners = [MessageStepListener]
    agent_messages = MESSAGE_AGENT_MESSAGES
    settings = MESSAGE_SETTINGS
    requires_engine = ">=5,<6"
    block_conditions = [MessagesRead, MessagesAnswered]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.chat", "journal.core.docking", "journal.core.pins", "journal.core.drivers", "journal.core.dumps", "journal.core.settings", "journal.core.schedules", "journal.core.profiles"]
    models = [MessageModelDeclaration, MessageWorkSourceModelDeclaration]
    bindings = {EnvironmentActivity: MessageEnvironmentActivity}
    moves = [MessagesMove]
    views = [AttachedFile, ChatMessage, MainChatMark]
    migrations = [MessageHookScanIndexesMigration, MainMessageTargetsMigration, MessageSessionMigration, MessageTargetMigration, VisibleMessageIndexMigration, MessageReplyIndexMigration, MessagesTableMigration, MessageFilesMigration, MessageDeliveryMigration, MessageDeliveredColumnMigration, MessageCaptionsMigration, MessageReactionsMigration, MessageFlowchartMigration, MessagePeerMigration, MessageRecipientMigration, MessageHookIndexesMigration, MessageVisibilityMigration, MessageTypeIndexesMigration, MessageWorkSourcesMigration, WorkSourceSelectionsMigration, MessageParentEnvironmentMigration, MessageAgentTextMigration, MessageWorkSourcesEnvironmentIndexMigration]
    guards = [OneReplyPerMessageGuard, RepeatedMessageGuard, QuestionMessageGuard]
    handlers = [ReportSafeguardsStopHandler, RecordTypedPromptHandler, ResetMessageDeliveriesHandler, RecordParentReportHandler, RecordPeerMessageHandler, RecordMessageUpdatedLineHandler, DrawFlowchartHandler, ReactMessageHandler, SendMessageHandler, SendAgentMessageHandler, ReadMessageHandler, RecordMessageDeliveryHandler, TagMessageHandler, RecordWaitingMessageLineHandler, ChooseWorkSourceHandler, ClearWorkSourceHandler, NoteMessageReadHandler]
    needs = [UnreadMessageNeeds, UnansweredMessageNeeds]
    policies = [UnreadMessageShowPolicy]
    lines = [NewMessageLines, UnansweredMessageLines, MessageReadLines, ChatMannersLines, ChatOpeningLines, PlainCodeLines, ReplyNoteLines, AgentTextLines]
    effects = [MessageDeliveryEffect, MessageReadEffect, AgentTextEffect, TextBeforeToolEffect, TranscriptCatchUpEffect, TypedPromptEffect, PeerMessageEffect]
    subcommands = [MessageConversationsSubcommand, AgentReportsSubcommand, UnreadReportsSubcommand, AttachmentListSubcommand, DrawFlowchartSubcommand, ReactMessageSubcommand, SendMessageSubcommand, ReplyMessageSubcommand, ReadMessageSubcommand, UnreadMessagesSubcommand, TagMessageSubcommand, MainChatRowsSubcommand, ChatMessagesSubcommand, ChooseWorkSourceSubcommand, ClearWorkSourceSubcommand, WorkSourceSubcommand]
    windows = MESSAGES_WINDOWS
    marks = [MessageSummaryMark, MessageFiledMark, MessageEditedMark]
    skills = MESSAGES_SKILLS
    listeners = [NewSessionWorkSourceListener, ReportPinListener, MessageRowsListener, MessageEditedMarkListener, ReadMessageEditListener, WaitingMessageListener, WaitingMessageTypingListener, ReadMessageLineListener, ReleasedMessageLineListener, DeletedWorkSourceListener, DeletedAgentWorkSourceListener, TaggedImageBlockListener]
    seeders = [MessagesSeeder]
