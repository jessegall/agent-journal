from engine.driver.nudge import Nudge
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnreadSkillsNudge(NudgeDeclaration):
    """The nudge skills.unread_skills."""

    key = "skills.unread_skills"
    type = NudgeType.REFUSAL
    text = "Unread skills: {skills}: read them first"

    # the line that names every unread skill
    @classmethod
    def naming(cls, skills: list[str]) -> Nudge:
        return cls.declared().nudge(skills=", ".join(skills))
