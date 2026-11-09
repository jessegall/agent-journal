from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

STEP_WAITS = NudgeDeclaration("sequences.step_waits", NudgeType.REFUSAL, 'sequence:{sequence} step {step} waits')

STEP_EDIT_BAN = NudgeDeclaration("sequences.step_holds_edits", NudgeType.REFUSAL, "step {step} of sequence:{sequence} holds file edits")
SEQUENCE_STARTED = NudgeDeclaration("sequences.started", NudgeType.STEERING, "sequence:{sequence} started by what just happened")

STEP_REFUSES_COMMAND = NudgeDeclaration("sequences.step_refuses_command", NudgeType.REFUSAL, "step {step} of sequence:{sequence} does not allow this command")
SEQUENCE_UNFINISHED = NudgeDeclaration("sequences.unfinished_at_stop", NudgeType.REFUSAL, "sequence:{sequence} step {step} is not finished")

SEQUENCE_NUDGES = [STEP_WAITS, STEP_EDIT_BAN, SEQUENCE_STARTED, STEP_REFUSES_COMMAND, SEQUENCE_UNFINISHED]
