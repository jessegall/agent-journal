from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SecretsFolderBanNudge(NudgeDeclaration):
    """The nudge secrets.out_of_reach."""

    key = "secrets.out_of_reach"
    type = NudgeType.SAFETY_REFUSAL
    text = "The secrets folder is off limits: run programs that need a secret through the secret command"
