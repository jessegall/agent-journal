from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ManagedHookRefusalNudge(NudgeDeclaration):
    """The nudge drivers.managed_hook_refusal."""

    key = "drivers.managed_hook_refusal"
    type = NudgeType.REFUSAL
    text = "Project hooks refused for agent:{agent}"
    turn_limited = False
