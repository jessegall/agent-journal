from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TranscriptionImportRequestNudge(NudgeDeclaration):
    """The nudge transcriptions.fetch_requested."""

    key = "transcriptions.fetch_requested"
    type = NudgeType.STEERING
    text = "Fetch the transcriptions task:{task} asks for"
    turn_limited = False
