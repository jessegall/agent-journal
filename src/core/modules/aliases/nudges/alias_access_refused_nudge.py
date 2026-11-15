from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class AliasAccessRefusedNudge(NudgeDeclaration):
    """The nudge aliases.access_refused."""

    key = "aliases.access_refused"
    type = NudgeType.REFUSAL
    text = "Agents may only run aliases marked for agents: ask the main agent to mark this one"
