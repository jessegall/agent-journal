from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SandboxFolderMissingNudge(NudgeDeclaration):
    """The nudge processes.sandbox_folder_missing."""

    key = "processes.sandbox_folder_missing"
    type = NudgeType.REFUSAL
    text = "The shell sandbox needs a registered folder and this agent has none: restart it through its start command"
