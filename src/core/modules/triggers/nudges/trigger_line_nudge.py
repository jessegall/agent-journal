from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TriggerLineNudge(NudgeDeclaration):
    """The nudge triggers.trigger_line."""

    key = "triggers.trigger_line"
    type = NudgeType.NOTICE
    text = "trigger:{trigger} fired"
    turn_limited = False
    plural_text = "triggers {trigger} fired"
    id_field = "trigger"
