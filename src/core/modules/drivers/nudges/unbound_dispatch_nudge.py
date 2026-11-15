from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnboundDispatchNudge(NudgeDeclaration):
    """The nudge drivers.unbound_dispatch."""

    key = "drivers.unbound_dispatch"
    type = NudgeType.REFUSAL
    text = "The dispatch has no concrete job: give it a description and a bounded prompt"
    turn_limited = False
