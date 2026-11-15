from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class AgentLineAvailableNudge(NudgeDeclaration):
    """The nudge drivers.agent_line_available."""

    key = "drivers.agent_line_available"
    type = NudgeType.NOTICE
    text = "agent-line:{line}"
    turn_limited = False
    id_field = "line"
    plural_text = "agent-lines {line}"
