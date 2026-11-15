from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ManagedHookLineNudge(NudgeDeclaration):
    """The nudge drivers.managed_hook_line."""

    key = "drivers.managed_hook_line"
    type = NudgeType.NOTICE
    text = "{line}"
    turn_limited = False
