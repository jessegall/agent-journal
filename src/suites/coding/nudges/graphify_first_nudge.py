from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class GraphifyFirstNudge(NudgeDeclaration):
    """The nudge tools.graphify_first."""

    key = "tools.graphify_first"
    type = NudgeType.REFUSAL
    text = "{count} searches without Graphify: first run graphify query with 2 to 4 code names, then explain one"
    turn_limited = False
