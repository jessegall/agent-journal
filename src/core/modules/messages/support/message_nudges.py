from engine.driver.count_down import CountDown
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.messages.nudges.unread_message_stop_nudge import UnreadMessageStopNudge
from core.modules.messages.nudges.unread_display_refusal_nudge import UnreadDisplayRefusalNudge
from core.modules.messages.nudges.new_message_nudge import NewMessageNudge
from core.modules.messages.nudges.message_reaction_nudge import MessageReactionNudge
from core.modules.messages.nudges.message_updated_nudge import MessageUpdatedNudge
from core.modules.messages.nudges.new_messages_nudge import NewMessagesNudge
from core.modules.messages.nudges.message_file_nudge import MessageFileNudge
from core.modules.messages.nudges.message_note_nudge import MessageNoteNudge
from core.modules.messages.nudges.image_tag_request_nudge import ImageTagRequestNudge
from core.modules.messages.nudges.repeated_closing_nudge import RepeatedClosingNudge
from core.modules.messages.nudges.closing_choice_nudge import ClosingChoiceNudge
from core.modules.messages.nudges.closing_line_hidden_nudge import ClosingLineHiddenNudge
from core.modules.messages.nudges.reply_command_nudge import ReplyCommandNudge
from core.modules.messages.nudges.unanswered_nudge import UnansweredNudge
from core.modules.messages.nudges.unanswered_refusal_nudge import UnansweredRefusalNudge
from core.modules.messages.nudges.unread_refusal_nudge import UnreadRefusalNudge
from core.modules.messages.nudges.shop_talk_nudge import ShopTalkNudge
from core.modules.messages.nudges.third_person_nudge import ThirdPersonNudge
from core.modules.messages.nudges.em_dash_nudge import EmDashNudge
from core.modules.messages.nudges.paragraph_nudge import ParagraphNudge
from core.modules.messages.nudges.journal_line_note_nudge import JournalLineNoteNudge
from core.modules.messages.nudges.journal_chat_rule_nudge import JournalChatRuleNudge
from core.modules.messages.nudges.journal_laws_nudge import JournalLawsNudge
from core.modules.messages.nudges.reply_note_nudge import ReplyNoteNudge
from core.modules.messages.nudges.plain_code_nudge import PlainCodeNudge

UNANSWERED_TOOL_USES = 10
UNREAD_TOOL_USES = 20
UNANSWERED_COUNTDOWN = CountDown("messages.unanswered_countdown", "reply to message {messages}", ToolUseSpan(UNANSWERED_TOOL_USES))
UNREAD_COUNTDOWN = CountDown("messages.unread_countdown", "read message {messages}", ToolUseSpan(UNREAD_TOOL_USES))

MESSAGE_NUDGES = [MessageReactionNudge, MessageUpdatedNudge, UnreadMessageStopNudge, UnreadDisplayRefusalNudge, NewMessageNudge, NewMessagesNudge, MessageFileNudge, MessageNoteNudge, ImageTagRequestNudge, RepeatedClosingNudge, ClosingLineHiddenNudge, ClosingChoiceNudge, ReplyCommandNudge, UnansweredNudge, UNANSWERED_COUNTDOWN.declaration, UnansweredRefusalNudge,
                  UNREAD_COUNTDOWN.declaration, UnreadRefusalNudge, ShopTalkNudge, ThirdPersonNudge, EmDashNudge, ParagraphNudge, JournalLineNoteNudge, JournalChatRuleNudge, JournalLawsNudge, PlainCodeNudge, ReplyNoteNudge]
