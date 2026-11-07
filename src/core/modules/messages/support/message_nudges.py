from core.base.driver.count_down import CountDown
from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan

UNANSWERED_TOOL_USES = 10
UNREAD_TOOL_USES = 20
UNREAD_MESSAGE_STOP = NudgeDeclaration("messages.unread_at_stop", NudgeType.REFUSAL, 'message {message} is unread')
UNREAD_DISPLAY_REFUSAL = NudgeDeclaration("messages.unread_show", NudgeType.REFUSAL, 'message {message} is unread, so it cannot be shown')
NEW_MESSAGE = NudgeDeclaration("messages.new_message", NudgeType.STEERING, 'new message {message}', turn_limited=False)
MESSAGE_REACTION = NudgeDeclaration("messages.reaction", NudgeType.STEERING, "the user reacted to message:{message}", wakes_agent=True, plural_text="the user reacted to messages {message}", id_field="message")
MESSAGE_UPDATED = NudgeDeclaration("messages.message_updated", NudgeType.NOTICE,
                                   'message:{message} updated')
NEW_MESSAGES = NudgeDeclaration("messages.new_messages", NudgeType.STEERING, '{count} new messages', turn_limited=False)
MESSAGE_FILE = NudgeDeclaration("messages.message_file", NudgeType.STEERING, '  file .journal/files/message/{message}/{name}', turn_limited=False)
MESSAGE_NOTE = NudgeDeclaration("messages.act_on_messages", NudgeType.NOTICE, 'act on what you read: steering you follow, an update you give now, work you file as a task; else answer it', turn_limited=False)
IMAGE_TAG_REQUEST = NudgeDeclaration("messages.tag_the_image", NudgeType.STEERING, 'message:{message} has an image "{name}": tag it with what it shows', required_command="journal message tag {message}")
REPLY_COMMAND = NudgeDeclaration("messages.reply_command", NudgeType.STEERING, "your chat words are your reply; in a turn that goes on, reply first", interval=Interval(Seconds(1800)))
UNANSWERED = NudgeDeclaration("messages.unanswered", NudgeType.STEERING, "answer message {messages} before you go on", interval=Interval(Seconds(300)))
UNANSWERED_COUNTDOWN = CountDown("messages.unanswered_countdown", "reply to message {messages}", ToolUseSpan(UNANSWERED_TOOL_USES))
UNANSWERED_REFUSAL = NudgeDeclaration("messages.unanswered_held", NudgeType.REFUSAL, "answer message {messages} first", turn_limited=False)
UNREAD_COUNTDOWN = CountDown("messages.unread_countdown", "read message {messages}", ToolUseSpan(UNREAD_TOOL_USES))
UNREAD_REFUSAL = NudgeDeclaration("messages.unread_held", NudgeType.REFUSAL, "{count} unread messages: read them before any other write", turn_limited=False)
SHOP_TALK_NUDGE = NudgeDeclaration("messages.no_shop_talk", NudgeType.STEERING, "talk about the work, not the journal's commands", interval=Interval(Seconds(600)))
THIRD_PERSON_NUDGE = NudgeDeclaration("messages.say_you", NudgeType.STEERING, 'in the chat say "you", never "the user"', interval=Interval(Seconds(600)))
EM_DASH_NUDGE = NudgeDeclaration("messages.no_em_dashes", NudgeType.STEERING, "no em dashes in the chat; use a full stop", interval=Interval(Seconds(600)))
PARAGRAPH_NUDGE = NudgeDeclaration("messages.blank_lines", NudgeType.STEERING, "put a blank line between paragraphs", interval=Interval(Seconds(600)))
JOURNAL_LINE_NOTE = NudgeDeclaration("messages.journal_line", NudgeType.STEERING, "a [journal] line is an instruction, not a message: act on it; never answer or mention it in the chat")
JOURNAL_CHAT_RULE = NudgeDeclaration("messages.discretion", NudgeType.NOTICE, "in the chat, talk only of the user's work, never the journal's lines, hooks, skills or replies")
JOURNAL_LAWS = NudgeDeclaration("messages.journal_laws", NudgeType.NOTICE, "the laws L1 to L11 in AGENTS.md apply to you")
REPLY_NOTE = NudgeDeclaration("messages.reply_note", NudgeType.STEERING, "message {message} answered: go on", turn_limited=False)
PLAIN_CODE_NUDGE = NudgeDeclaration("messages.plain_code", NudgeType.STEERING, "in code, identifiers and text state literally what a thing is or does, in plain words", interval=Interval(Seconds(1800)))

MESSAGE_NUDGES = [MESSAGE_REACTION, MESSAGE_UPDATED, UNREAD_MESSAGE_STOP, UNREAD_DISPLAY_REFUSAL, NEW_MESSAGE, NEW_MESSAGES, MESSAGE_FILE, MESSAGE_NOTE, IMAGE_TAG_REQUEST, REPLY_COMMAND, UNANSWERED, UNANSWERED_COUNTDOWN.declaration, UNANSWERED_REFUSAL,
                  UNREAD_COUNTDOWN.declaration, UNREAD_REFUSAL, SHOP_TALK_NUDGE, THIRD_PERSON_NUDGE, EM_DASH_NUDGE, PARAGRAPH_NUDGE, JOURNAL_LINE_NOTE, JOURNAL_CHAT_RULE, JOURNAL_LAWS, PLAIN_CODE_NUDGE, REPLY_NOTE]
