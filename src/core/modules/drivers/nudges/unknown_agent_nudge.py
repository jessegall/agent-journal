from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnknownAgentNudge(NudgeDeclaration):
    """The nudge drivers.unknown_agent."""

    key = "drivers.unknown_agent"
    type = NudgeType.SAFETY_REFUSAL
    text = "No agent exists in the journal for this session, so the tool did not run: report what happened"
