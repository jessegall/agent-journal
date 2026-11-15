from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerRouteFallbackNudge(NudgeDeclaration):
    """The nudge workers.route_fallback."""

    key = "workers.route_fallback"
    type = NudgeType.STEERING
    text = "Route {route}: {tasks} went to {program}"
    turn_limited = False
