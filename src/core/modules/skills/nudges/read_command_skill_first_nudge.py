from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReadCommandSkillFirstNudge(NudgeDeclaration):
    """The nudge skills.read_command_skill_first."""

    key = "skills.read_command_skill_first"
    type = NudgeType.REFUSAL
    text = "This command needs a skill you have not read: {instruction}"
    path_fields = ["instruction"]
