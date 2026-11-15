from engine.enums.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WaitEndedNudge(NudgeDeclaration):
    """The nudge waits.wait_over."""

    key = "waits.wait_over"
    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = "wait:{wait} is over: continue"
    plural_text = "waits {wait} are over"
    id_field = "wait"
    turn_limited = False
    wakes_agent = True
