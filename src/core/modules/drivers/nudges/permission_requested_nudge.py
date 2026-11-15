from engine.enums.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PermissionRequestedNudge(NudgeDeclaration):
    """The nudge drivers.permission_asked."""

    key = "drivers.permission_asked"
    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = "agent {agent} asks permission for one action, request {request}: allow it once or decline it"
    turn_limited = False
    wakes_agent = True
