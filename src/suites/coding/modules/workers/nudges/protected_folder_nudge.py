from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ProtectedFolderNudge(NudgeDeclaration):
    """The nudge workers.protected_folder."""

    key = "workers.protected_folder"
    type = NudgeType.REFUSAL
    text = "{folder} is protected: report the change to the main agent"
    turn_limited = False
