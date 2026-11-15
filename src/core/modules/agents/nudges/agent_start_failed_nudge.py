from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class AgentStartFailedNudge(NudgeDeclaration):
    """The nudge agents.start_failed."""

    key = "agents.start_failed"
    type = NudgeType.STEERING
    text = "agent:{agent} failed to start: check its error, then retry or report it"
    wakes_agent = True
