from engine.driver.count_down import CountDown
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan

UNANSWERED_TOOL_USES = 10
UNREAD_TOOL_USES = 20
UNREAD_MESSAGE_STOP = NudgeDeclaration("messages.unread_at_stop", NudgeType.REFUSAL, "Message {message} is unread: read it before you stop")
UNREAD_DISPLAY_REFUSAL = NudgeDeclaration("messages.unread_show", NudgeType.REFUSAL, "Message {message} is unread, so it cannot be shown: read it first")
NEW_MESSAGE = NudgeDeclaration("messages.new_message", NudgeType.STEERING, "New message {message}: read it", turn_limited=False)
MESSAGE_REACTION = NudgeDeclaration("messages.reaction", NudgeType.STEERING, "The user reacted to message:{message}: check the reaction", wakes_agent=True, plural_text="the user reacted to messages {message}", id_field="message")
MESSAGE_UPDATED = NudgeDeclaration("messages.message_updated", NudgeType.NOTICE,
                                   "message:{message} was updated: read it again")
NEW_MESSAGES = NudgeDeclaration("messages.new_messages", NudgeType.STEERING, "{count} new messages: read them", turn_limited=False)
MESSAGE_FILE = NudgeDeclaration("messages.message_file", NudgeType.STEERING, '  file .journal/files/message/{message}/{name}', turn_limited=False)
MESSAGE_NOTE = NudgeDeclaration("messages.act_on_messages", NudgeType.NOTICE, 'Act on the message: follow steering, create a task or edit an existing one, save memories worth keeping, then reply', turn_limited=False)
IMAGE_TAG_REQUEST = NudgeDeclaration("messages.tag_the_image", NudgeType.STEERING, "message:{message} has image \"{name}\": tag it with what it shows", required_command="journal message tag {message}")
REPEATED_CLOSING = NudgeDeclaration("messages.repeated_closing", NudgeType.STEERING, "Your closing words repeat message {message}, so they were not shown")
CLOSING_CHOICE = NudgeDeclaration("messages.closing_choice", NudgeType.STEERING, "Your closing words ask the user to choose: put the choice in the question tool instead")
CLOSING_LINE_HIDDEN = NudgeDeclaration("messages.one_line_closing", NudgeType.STEERING, "Your reply was already sent, so your one closing line was not shown")
REPLY_COMMAND = NudgeDeclaration("messages.reply_command", NudgeType.STEERING, "Your chat words are your reply: in a turn that continues, reply first", interval=Interval(Seconds(1800)))
UNANSWERED = NudgeDeclaration("messages.unanswered", NudgeType.STEERING, "Answer message {messages} before continuing", interval=Interval(Seconds(300)))
UNANSWERED_COUNTDOWN = CountDown("messages.unanswered_countdown", "reply to message {messages}", ToolUseSpan(UNANSWERED_TOOL_USES))
UNANSWERED_REFUSAL = NudgeDeclaration("messages.unanswered_held", NudgeType.REFUSAL, "Answer message {messages} first", turn_limited=False)
UNREAD_COUNTDOWN = CountDown("messages.unread_countdown", "read message {messages}", ToolUseSpan(UNREAD_TOOL_USES))
UNREAD_REFUSAL = NudgeDeclaration("messages.unread_held", NudgeType.REFUSAL, "{count} unread messages: read them before any other write", turn_limited=False)
SHOP_TALK_NUDGE = NudgeDeclaration("messages.no_shop_talk", NudgeType.STEERING, "Talk about the work, not the journal's commands", interval=Interval(Seconds(600)))
THIRD_PERSON_NUDGE = NudgeDeclaration("messages.say_you", NudgeType.STEERING, "In the chat, say \"you\", never \"the user\"", interval=Interval(Seconds(600)))
EM_DASH_NUDGE = NudgeDeclaration("messages.no_em_dashes", NudgeType.STEERING, "No em dashes in the chat: use a full stop", interval=Interval(Seconds(600)))
PARAGRAPH_NUDGE = NudgeDeclaration("messages.blank_lines", NudgeType.STEERING, "Separate paragraphs with a blank line", interval=Interval(Seconds(600)))
JOURNAL_LINE_NOTE = NudgeDeclaration("messages.journal_line", NudgeType.STEERING, "A [journal] line is an instruction, not a message: act on it, never answer or mention it in the chat")
JOURNAL_CHAT_RULE = NudgeDeclaration("messages.discretion", NudgeType.NOTICE, "In the chat, talk only about the user's work, never the journal's lines, hooks, skills or replies")
JOURNAL_LAWS = NudgeDeclaration("messages.journal_laws", NudgeType.NOTICE, "Laws L1 to L11 in JOURNAL.md apply to you")
REPLY_NOTE = NudgeDeclaration("messages.reply_note", NudgeType.STEERING, "Message {message} answered: continue", turn_limited=False)
PLAIN_CODE_NUDGE = NudgeDeclaration("messages.plain_code", NudgeType.STEERING, "In code, name identifiers and text literally: say plainly what a thing is or does", interval=Interval(Seconds(1800)))

MESSAGE_NUDGES = [MESSAGE_REACTION, MESSAGE_UPDATED, UNREAD_MESSAGE_STOP, UNREAD_DISPLAY_REFUSAL, NEW_MESSAGE, NEW_MESSAGES, MESSAGE_FILE, MESSAGE_NOTE, IMAGE_TAG_REQUEST, REPEATED_CLOSING, CLOSING_LINE_HIDDEN, CLOSING_CHOICE, REPLY_COMMAND, UNANSWERED, UNANSWERED_COUNTDOWN.declaration, UNANSWERED_REFUSAL,
                  UNREAD_COUNTDOWN.declaration, UNREAD_REFUSAL, SHOP_TALK_NUDGE, THIRD_PERSON_NUDGE, EM_DASH_NUDGE, PARAGRAPH_NUDGE, JOURNAL_LINE_NOTE, JOURNAL_CHAT_RULE, JOURNAL_LAWS, PLAIN_CODE_NUDGE, REPLY_NOTE]
