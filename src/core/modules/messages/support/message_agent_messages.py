from engine.driver.count_down import CountDown
from core.modules.drivers.models.support.tool_use_window import ToolUseWindow
from core.modules.messages.agent_messages.unread_message_stop_notice import UnreadMessageStopNotice
from core.modules.messages.agent_messages.unread_display_refusal_message import UnreadDisplayRefusalMessage
from core.modules.messages.agent_messages.new_message_notice import NewMessageNotice
from core.modules.messages.agent_messages.message_reaction_notice import MessageReactionNotice
from core.modules.messages.agent_messages.message_updated_notice import MessageUpdatedNotice
from core.modules.messages.agent_messages.new_messages_notice import NewMessagesNotice
from core.modules.messages.agent_messages.message_file_notice import MessageFileNotice
from core.modules.messages.agent_messages.message_note_notice import MessageNoteNotice
from core.modules.messages.agent_messages.image_tag_request_message import ImageTagRequestMessage
from core.modules.messages.agent_messages.repeated_closing_message import RepeatedClosingMessage
from core.modules.messages.agent_messages.closing_choice_message import ClosingChoiceMessage
from core.modules.messages.agent_messages.closing_line_hidden_message import ClosingLineHiddenMessage
from core.modules.messages.agent_messages.reply_command_message import ReplyCommandMessage
from core.modules.messages.agent_messages.unanswered_message_reminder import UnansweredMessageReminder
from core.modules.messages.agent_messages.unanswered_refusal_message import UnansweredRefusalMessage
from core.modules.messages.agent_messages.unread_refusal_message import UnreadRefusalMessage
from core.modules.messages.agent_messages.shop_talk_message import ShopTalkMessage
from core.modules.messages.agent_messages.third_person_message import ThirdPersonMessage
from core.modules.messages.agent_messages.em_dash_message import EmDashMessage
from core.modules.messages.agent_messages.paragraph_message import ParagraphMessage
from core.modules.messages.agent_messages.journal_line_note_message import JournalLineNoteMessage
from core.modules.messages.agent_messages.journal_chat_rule_message import JournalChatRuleMessage
from core.modules.messages.agent_messages.journal_laws_message import JournalLawsMessage
from core.modules.messages.agent_messages.reply_note_message import ReplyNoteMessage
from core.modules.messages.agent_messages.plain_code_message import PlainCodeMessage

UNANSWERED_TOOL_USES = 10
UNREAD_TOOL_USES = 20
UNANSWERED_COUNTDOWN = CountDown("messages.unanswered_countdown", "reply to message {messages}", ToolUseWindow(UNANSWERED_TOOL_USES))
UNREAD_COUNTDOWN = CountDown("messages.unread_countdown", "read message {messages}", ToolUseWindow(UNREAD_TOOL_USES))

MESSAGE_AGENT_MESSAGES = [MessageReactionNotice, MessageUpdatedNotice, UnreadMessageStopNotice, UnreadDisplayRefusalMessage, NewMessageNotice, NewMessagesNotice, MessageFileNotice, MessageNoteNotice, ImageTagRequestMessage, RepeatedClosingMessage, ClosingLineHiddenMessage, ClosingChoiceMessage, ReplyCommandMessage, UnansweredMessageReminder, UNANSWERED_COUNTDOWN.declaration, UnansweredRefusalMessage,
                  UNREAD_COUNTDOWN.declaration, UnreadRefusalMessage, ShopTalkMessage, ThirdPersonMessage, EmDashMessage, ParagraphMessage, JournalLineNoteMessage, JournalChatRuleMessage, JournalLawsMessage, PlainCodeMessage, ReplyNoteMessage]
