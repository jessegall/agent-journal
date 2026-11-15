from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class LoadedSkillRefusalNudge(NudgeDeclaration):
    """The nudge skills.already_loaded."""

    key = "skills.already_loaded"
    type = NudgeType.REFUSAL
    text = "The skill {name} is loaded in your context already: use what you read, or skip this refusal if you must read it again"
