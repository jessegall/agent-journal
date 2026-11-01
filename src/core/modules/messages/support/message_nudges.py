from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

UNREAD_AT_STOP = NudgeDeclaration("messages.unread_at_stop", NudgeType.REFUSAL, 'message {message} is unread: journal message read {message}')
NEW_MESSAGE = NudgeDeclaration("messages.new_message", NudgeType.INSTRUCTION, '[journal] new message {message}: journal message read {message}')
NEW_MESSAGES = NudgeDeclaration("messages.new_messages", NudgeType.INSTRUCTION, '[journal] {count} new messages: journal message unread')
MESSAGE_FILE = NudgeDeclaration("messages.message_file", NudgeType.REMARK, '  file {path}')
ACT_ON_MESSAGES = NudgeDeclaration("messages.act_on_messages", NudgeType.INSTRUCTION, 'act on what you read: if it steers your work, take it as steering and follow it from now on; if it asks for an update, give the update now; if it asks for work, make a task for it; otherwise answer it')
TAG_THE_IMAGE = NudgeDeclaration("messages.tag_the_image", NudgeType.INSTRUCTION, 'message {message} attaches an image: open {path}, then journal message tag {message} "{name}" "<what it shows>"')

MESSAGE_NUDGES = [UNREAD_AT_STOP, NEW_MESSAGE, NEW_MESSAGES, MESSAGE_FILE, ACT_ON_MESSAGES, TAG_THE_IMAGE]
