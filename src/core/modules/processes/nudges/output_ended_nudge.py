from engine.driver.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class OutputEndedNudge(NudgeDeclaration):
    """The nudge processes.output_ended."""

    key = "processes.output_ended"

    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = "Output {output} ended"
    turn_limited = False
    wakes_agent = True
