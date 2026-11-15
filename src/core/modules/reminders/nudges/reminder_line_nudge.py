from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReminderLineNudge(NudgeDeclaration):
    """The nudge reminders.line."""

    key = "reminders.line"
    type = NudgeType.STEERING
    text = "reminder:{reminder} is due: act on it"
    turn_limited = False
    id_field = "reminder"
    plural_text = "reminders {reminder} are due"
