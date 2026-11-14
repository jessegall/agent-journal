from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

LINE_SOURCE = "transcriptions"
TRANSCRIPTION_CHANGED = NudgeDeclaration("transcriptions.changed", NudgeType.STEERING, "transcription:{transcription} has new text: summarize it in task:{task}", turn_limited=False)
TRANSCRIPTION_IMPORT_REQUEST = NudgeDeclaration("transcriptions.fetch_requested", NudgeType.STEERING, "Fetch the transcriptions task:{task} asks for", turn_limited=False)
TRANSCRIPTION_NUDGES = [TRANSCRIPTION_CHANGED, TRANSCRIPTION_IMPORT_REQUEST]
