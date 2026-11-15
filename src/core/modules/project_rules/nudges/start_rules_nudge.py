from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class StartRulesNudge(NudgeDeclaration):
    """The nudge project_rules.start_rules."""

    key = "project_rules.start_rules"
    type = NudgeType.STEERING
    text = "{count} project rules apply: read them"
    turn_limited = False
