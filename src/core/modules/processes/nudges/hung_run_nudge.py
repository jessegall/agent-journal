from engine.enums.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class HungRunNudge(NudgeDeclaration):
    """The nudge processes.hung_run."""

    key = "processes.hung_run"
    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = "Output {output} printed nothing for {seconds}s and was stopped: its output is kept"
    wakes_agent = True
