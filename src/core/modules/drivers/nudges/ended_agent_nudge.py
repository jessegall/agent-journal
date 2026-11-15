from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class EndedAgentNudge(NudgeDeclaration):
    """The nudge drivers.ended_agent."""

    key = "drivers.ended_agent"
    type = NudgeType.SAFETY_REFUSAL
    text = "This agent has ended: stop now, nothing more is recorded"
