from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

STEP_WAITS = NudgeDeclaration("sequences.step_waits", NudgeType.REFUSAL, 'sequence:{sequence} step {step} waits: journal sequence follow')

STEP_EDIT_BAN = NudgeDeclaration("sequences.step_holds_edits", NudgeType.REFUSAL, "step {step} of sequence:{sequence} holds file edits: journal sequence next")
SEQUENCE_STARTED = NudgeDeclaration("sequences.started", NudgeType.STEERING, "sequence:{sequence} started by what just happened: journal sequence follow")

SEQUENCE_NUDGES = [STEP_WAITS, STEP_EDIT_BAN, SEQUENCE_STARTED]
