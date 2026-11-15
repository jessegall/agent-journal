from engine.enums.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class CacheKeepaliveNudge(NudgeDeclaration):
    """The nudge drivers.cache_keepalive."""

    key = "drivers.cache_keepalive"
    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = "Cache keep-alive only, no work asked: stop again right away"
    turn_limited = False
    wakes_agent = True
