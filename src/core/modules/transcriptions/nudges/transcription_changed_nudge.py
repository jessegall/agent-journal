from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TranscriptionChangedNudge(NudgeDeclaration):
    """The nudge transcriptions.changed."""

    key = "transcriptions.changed"
    type = NudgeType.STEERING
    text = "transcription:{transcription} has new text: summarize it in task:{task}"
    turn_limited = False
