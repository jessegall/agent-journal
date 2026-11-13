from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

STEP_WAITS = NudgeDeclaration("sequences.step_waits", NudgeType.REFUSAL, "sequence:{sequence} step {step} is waiting")

STEP_EDIT_BAN = NudgeDeclaration("sequences.step_holds_edits", NudgeType.REFUSAL, "Step {step} of sequence:{sequence} blocks file edits")
SEQUENCE_STARTED = NudgeDeclaration("sequences.started", NudgeType.STEERING, "sequence:{sequence} was started by what just happened")

STEP_REFUSES_COMMAND = NudgeDeclaration("sequences.step_refuses_command", NudgeType.REFUSAL, "Step {step} of sequence:{sequence} does not allow this command")
SEQUENCE_UNFINISHED = NudgeDeclaration("sequences.unfinished_at_stop", NudgeType.REFUSAL, "sequence:{sequence} step {step} is not finished: finish it before you stop")

SEQUENCE_NUDGES = [STEP_WAITS, STEP_EDIT_BAN, SEQUENCE_STARTED, STEP_REFUSES_COMMAND, SEQUENCE_UNFINISHED]
