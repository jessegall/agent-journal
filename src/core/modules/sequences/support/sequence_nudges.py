from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

STEP_WAITS = NudgeDeclaration("sequences.step_waits", NudgeType.REFUSAL, 'sequence {sequence} step {step} waits: {text}; run journal sequence follow first')

STEP_EDIT_BAN = NudgeDeclaration("sequences.step_holds_edits", NudgeType.REFUSAL, "step {step} of sequence {sequence} holds file edits: {text}; finish it with journal sequence next first")
SEQUENCE_STARTED = NudgeDeclaration("sequences.started", NudgeType.INSTRUCTION, "sequence {sequence}, {title}, started by what just happened: run journal sequence follow and do step 1: {step}", pays="")

SEQUENCE_NUDGES = [STEP_WAITS, STEP_EDIT_BAN, SEQUENCE_STARTED]
