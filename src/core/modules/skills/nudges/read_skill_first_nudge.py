from engine.driver.nudge import Nudge
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReadSkillFirstNudge(NudgeDeclaration):
    """The nudge skills.read_skill_first."""

    key = "skills.read_skill_first"
    type = NudgeType.REFUSAL
    text = "A skill is unread: {instruction}"
    path_fields = ["instruction"]

    # the line that names how to read the skill
    @classmethod
    def instructed(cls, instruction: str) -> Nudge:
        return cls.declared().nudge(instruction=instruction)
