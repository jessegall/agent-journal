from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

UNREAD_AT_STOP = NudgeDeclaration("messages.unread_at_stop", NudgeType.REFUSAL, 'message {message} is unread: journal message read {message}')
NEW_MESSAGE = NudgeDeclaration("messages.new_message", NudgeType.INSTRUCTION, '[journal] new message {message}: journal message read {message}')
NEW_MESSAGES = NudgeDeclaration("messages.new_messages", NudgeType.INSTRUCTION, '[journal] {count} new messages: journal message unread', once_per_turn=False)
MESSAGE_FILE = NudgeDeclaration("messages.message_file", NudgeType.REMARK, '  file {path}')
ACT_ON_MESSAGES = NudgeDeclaration("messages.act_on_messages", NudgeType.INSTRUCTION, 'act on what you read: if it steers your work, take it as steering and follow it from now on; if it asks for an update, give the update now; if it asks for work, make a task for it; otherwise answer it')
TAG_THE_IMAGE = NudgeDeclaration("messages.tag_the_image", NudgeType.INSTRUCTION, 'message {message} attaches an image: open {path}, then journal message tag {message} "{name}" "<what it shows>"')
REPLY_COMMAND = NudgeDeclaration("messages.reply_command", NudgeType.INSTRUCTION, "your words in the chat are your reply; in a turn that goes on with tools, reply first with journal message reply <n> '<text>'", repeat_seconds=1800)
UNANSWERED = NudgeDeclaration("messages.unanswered", NudgeType.INSTRUCTION, "answer message {messages} before you go on", repeat_seconds=300)
UNANSWERED_COUNTDOWN = NudgeDeclaration("messages.unanswered_countdown", NudgeType.INSTRUCTION, "reply to message {messages}; tool calls wait after {count} more", once_per_turn=False)
UNANSWERED_HELD = NudgeDeclaration("messages.unanswered_held", NudgeType.REFUSAL, "answer message {messages} first: write your reply, or journal message reply {message} '<text>'; tool calls wait until you do", once_per_turn=False)
UNREAD_COUNTDOWN = NudgeDeclaration("messages.unread_countdown", NudgeType.INSTRUCTION, "read message {messages} with journal message unread; writes wait after {count} more", once_per_turn=False)
UNREAD_HELD = NudgeDeclaration("messages.unread_held", NudgeType.REFUSAL, "{count} unread messages: run journal message unread before any other write", once_per_turn=False)
NO_SHOP_TALK = NudgeDeclaration("messages.no_shop_talk", NudgeType.REMARK, "talk about the work, not the journal's commands", repeat_seconds=600)
SAY_YOU = NudgeDeclaration("messages.say_you", NudgeType.REMARK, 'in the chat say "you", never "the user"', repeat_seconds=600)
NO_EM_DASHES = NudgeDeclaration("messages.no_em_dashes", NudgeType.REMARK, "no em dashes in the chat; use a full stop", repeat_seconds=600)
BLANK_LINES = NudgeDeclaration("messages.blank_lines", NudgeType.REMARK, "put a blank line between paragraphs", repeat_seconds=600)
JOURNAL_LINE = NudgeDeclaration("messages.journal_line", NudgeType.REMARK, "a [journal] line is an instruction, not a message: act on it; never answer or mention it in the chat")
DISCRETION = NudgeDeclaration("messages.discretion", NudgeType.INSTRUCTION, "in the chat, talk only of the user's work, never the journal's lines, hooks, skills, replies, or what you read, load or log")
PLAIN_CODE = NudgeDeclaration("messages.plain_code", NudgeType.REMARK, "in code, identifiers and text state literally what a thing is or does, in plain words", repeat_seconds=1800)

MESSAGE_NUDGES = [UNREAD_AT_STOP, NEW_MESSAGE, NEW_MESSAGES, MESSAGE_FILE, ACT_ON_MESSAGES, TAG_THE_IMAGE, REPLY_COMMAND, UNANSWERED, UNANSWERED_COUNTDOWN, UNANSWERED_HELD,
                  UNREAD_COUNTDOWN, UNREAD_HELD, NO_SHOP_TALK, SAY_YOU, NO_EM_DASHES, BLANK_LINES, JOURNAL_LINE, DISCRETION, PLAIN_CODE]
