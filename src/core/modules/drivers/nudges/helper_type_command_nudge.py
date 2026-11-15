from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class HelperTypeCommandNudge(NudgeDeclaration):
    """The nudge drivers.helper_type_command."""

    key = "drivers.helper_type_command"
    type = NudgeType.REFUSAL
    text = "A {helper_type} may not run {line}: it runs the groups {groups} and the lines {lines}; ask your main agent"
    full_text = True
