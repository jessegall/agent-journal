from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class AgentNoticeNudge(NudgeDeclaration):
    """The nudge drivers.agent_notice."""

    key = "drivers.agent_notice"
    type = NudgeType.STEERING
    text = "{text}"
    turn_limited = False
    path_fields = tuple(["text"])
    full_text = True
