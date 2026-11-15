from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PermissionUseFailedNudge(NudgeDeclaration):
    """The nudge drivers.permission_use_failed."""

    key = "drivers.permission_use_failed"
    type = NudgeType.STEERING
    text = "the journal could not mark your allowed request as used, so this action did not run: try it again"
