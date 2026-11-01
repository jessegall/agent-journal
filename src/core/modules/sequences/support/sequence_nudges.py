from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

STEP_WAITS = NudgeDeclaration("sequences.step_waits", NudgeType.REFUSAL, 'sequence {sequence} step {step} waits: {text}; run journal sequence follow first')

SEQUENCE_NUDGES = [STEP_WAITS]
