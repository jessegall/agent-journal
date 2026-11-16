from core.modules.messages.lines.agent_text_lines import AgentTextLines
from core.modules.messages.lines.chat_manners_lines import ChatMannersLines
from core.modules.messages.lines.chat_opening_lines import ChatOpeningLines
from core.modules.messages.lines.message_read_lines import MessageReadLines
from core.modules.messages.lines.new_message_lines import NewMessageLines
from core.modules.messages.lines.plain_code_lines import PlainCodeLines
from core.modules.messages.lines.reply_note_lines import ReplyNoteLines
from core.modules.messages.lines.unanswered_message_lines import UnansweredMessageLines

MESSAGES_LINES = [NewMessageLines, UnansweredMessageLines, MessageReadLines, ChatMannersLines, ChatOpeningLines, PlainCodeLines, ReplyNoteLines, AgentTextLines]
