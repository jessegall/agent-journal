from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

REMINDER_LINE = NudgeDeclaration("reminders.line", NudgeType.STEERING, "reminder:{reminder} is due", turn_limited=False, id_field="reminder", plural_text="reminders {reminder} are due")
REMINDER_BLOCK = NudgeDeclaration("reminders.block", NudgeType.REFUSAL, "reminder:{reminder} holds you", turn_limited=False)
REMINDER_NUDGES = [REMINDER_LINE, REMINDER_BLOCK]
