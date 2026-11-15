from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReminderBlockNudge(NudgeDeclaration):
    """The nudge reminders.block."""

    key = "reminders.block"
    type = NudgeType.REFUSAL
    text = "reminder:{reminder} is holding you: deal with it first"
    turn_limited = False
