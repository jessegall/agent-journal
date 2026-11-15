from engine.enums.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class OutputTimeoutNudge(NudgeDeclaration):
    """The nudge processes.output_timed_out."""

    key = "processes.output_timed_out"
    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = "Output {output} timed out after {seconds}s and was stopped: its output is kept"
    wakes_agent = True
