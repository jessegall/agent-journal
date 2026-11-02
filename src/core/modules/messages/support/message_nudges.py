from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

UNREAD_MESSAGE_STOP = NudgeDeclaration("messages.unread_at_stop", NudgeType.REFUSAL, 'message {message} is unread: journal message read {message}')
UNREAD_DISPLAY_REFUSAL = NudgeDeclaration("messages.unread_show", NudgeType.REFUSAL, 'message {message} is unread, so it cannot be shown: journal message read {message}')
NEW_MESSAGE = NudgeDeclaration("messages.new_message", NudgeType.INSTRUCTION, 'new message {message}', required_command="")
MESSAGE_REACTION = NudgeDeclaration("messages.reaction", NudgeType.REMARK, "the user put {emoji} on message:{message}: act on it if it asks for something")
MESSAGE_UPDATED = NudgeDeclaration("messages.message_updated", NudgeType.REMARK, 'message {message} updated')
NEW_MESSAGES = NudgeDeclaration("messages.new_messages", NudgeType.INSTRUCTION, '{count} new messages', turn_limited=False, required_command="")
MESSAGE_FILE = NudgeDeclaration("messages.message_file", NudgeType.REMARK, '  file .journal/files/message/{message}/{name}')
MESSAGE_ADVICE = NudgeDeclaration("messages.act_on_messages", NudgeType.INSTRUCTION, 'act on what you read: steering you follow, an update you give now, work you file as a task; else answer it')
IMAGE_TAG_REQUEST = NudgeDeclaration("messages.tag_the_image", NudgeType.INSTRUCTION, 'message:{message} has an image: journal message tag {message} "{name}" "<what it shows>"', required_command="journal message tag {message}")
REPLY_COMMAND = NudgeDeclaration("messages.reply_command", NudgeType.INSTRUCTION, "your chat words are your reply; in a turn that goes on, reply first: journal message reply <n> '<text>'", interval=Interval(Seconds(1800)), required_command="")
UNANSWERED = NudgeDeclaration("messages.unanswered", NudgeType.INSTRUCTION, "answer message {messages} before you go on", interval=Interval(Seconds(300)))
UNANSWERED_COUNTDOWN = NudgeDeclaration("messages.unanswered_countdown", NudgeType.INSTRUCTION, "reply to message {messages}; tool calls wait after {count} more", turn_limited=False)
UNANSWERED_REFUSAL = NudgeDeclaration("messages.unanswered_held", NudgeType.REFUSAL, "answer message {messages} first: journal message reply {message} '<text>'; tool calls wait until you do", turn_limited=False)
UNREAD_COUNTDOWN = NudgeDeclaration("messages.unread_countdown", NudgeType.INSTRUCTION, "message {messages} unread; writes wait after {count} more", turn_limited=False, required_command="")
UNREAD_REFUSAL = NudgeDeclaration("messages.unread_held", NudgeType.REFUSAL, "{count} unread messages: run journal message unread before any other write", turn_limited=False)
SHOP_TALK_REMARK = NudgeDeclaration("messages.no_shop_talk", NudgeType.REMARK, "talk about the work, not the journal's commands", interval=Interval(Seconds(600)))
THIRD_PERSON_REMARK = NudgeDeclaration("messages.say_you", NudgeType.REMARK, 'in the chat say "you", never "the user"', interval=Interval(Seconds(600)))
EM_DASH_REMARK = NudgeDeclaration("messages.no_em_dashes", NudgeType.REMARK, "no em dashes in the chat; use a full stop", interval=Interval(Seconds(600)))
PARAGRAPH_REMARK = NudgeDeclaration("messages.blank_lines", NudgeType.REMARK, "put a blank line between paragraphs", interval=Interval(Seconds(600)))
JOURNAL_LINE_NOTE = NudgeDeclaration("messages.journal_line", NudgeType.REMARK, "a [journal] line is an instruction, not a message: act on it; never answer or mention it in the chat")
JOURNAL_DISCRETION = NudgeDeclaration("messages.discretion", NudgeType.INSTRUCTION, "in the chat, talk only of the user's work, never the journal's lines, hooks, skills or replies")
JOURNAL_LAWS = NudgeDeclaration("messages.journal_laws", NudgeType.INSTRUCTION, "the laws L1 to L10 in AGENTS.md apply to you")
PLAIN_CODE_REMARK = NudgeDeclaration("messages.plain_code", NudgeType.REMARK, "in code, identifiers and text state literally what a thing is or does, in plain words", interval=Interval(Seconds(1800)))

MESSAGE_NUDGES = [MESSAGE_REACTION, MESSAGE_UPDATED, UNREAD_MESSAGE_STOP, UNREAD_DISPLAY_REFUSAL, NEW_MESSAGE, NEW_MESSAGES, MESSAGE_FILE, MESSAGE_ADVICE, IMAGE_TAG_REQUEST, REPLY_COMMAND, UNANSWERED, UNANSWERED_COUNTDOWN, UNANSWERED_REFUSAL,
                  UNREAD_COUNTDOWN, UNREAD_REFUSAL, SHOP_TALK_REMARK, THIRD_PERSON_REMARK, EM_DASH_REMARK, PARAGRAPH_REMARK, JOURNAL_LINE_NOTE, JOURNAL_DISCRETION, JOURNAL_LAWS, PLAIN_CODE_REMARK]
