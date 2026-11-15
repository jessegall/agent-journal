from engine.driver.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RunFrozenNudge(NudgeDeclaration):
    """The nudge processes.run_frozen."""

    key = "processes.run_frozen"

    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = "Output {output} printed nothing for {seconds}s and uses no CPU: read it, or it is stopped at {limit}s"
    wakes_agent = True
