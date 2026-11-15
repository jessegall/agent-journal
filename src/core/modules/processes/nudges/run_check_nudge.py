from engine.driver.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RunCheckNudge(NudgeDeclaration):
    """The nudge processes.look_at_run."""

    key = "processes.look_at_run"

    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = "Output {output} printed nothing for {seconds}s but uses CPU: read it, and stop it if it hangs"
    wakes_agent = True
