from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class FileLoadedNudge(NudgeDeclaration):
    """The nudge drivers.file-in-context."""

    key = "drivers.file-in-context"
    type = NudgeType.NOTICE
    text = "{path} is unchanged since you read it: use what is in your context"
    path_fields = tuple(["path"])
