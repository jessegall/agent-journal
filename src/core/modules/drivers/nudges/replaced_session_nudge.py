from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReplacedSessionNudge(NudgeDeclaration):
    """The nudge drivers.replaced_session."""

    key = "drivers.replaced_session"
    type = NudgeType.SAFETY_REFUSAL
    text = "A newer session of agent {agent} replaced this one: stop now, nothing more is recorded"
