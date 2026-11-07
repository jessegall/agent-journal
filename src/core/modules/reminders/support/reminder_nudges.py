from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

REMINDER_LINE = NudgeDeclaration("reminders.line", NudgeType.STEERING, "reminder:{reminder} is due: journal reminder show {reminder}", turn_limited=False)
REMINDER_BLOCK = NudgeDeclaration("reminders.block", NudgeType.REFUSAL, "reminder:{reminder} holds you: journal reminder show {reminder}", turn_limited=False)
REMINDER_NUDGES = [REMINDER_LINE, REMINDER_BLOCK]
