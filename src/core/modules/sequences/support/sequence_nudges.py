from core.modules.sequences.nudges.step_waits_nudge import StepWaitsNudge
from core.modules.sequences.nudges.step_edit_ban_nudge import StepEditBanNudge
from core.modules.sequences.nudges.sequence_started_nudge import SequenceStartedNudge
from core.modules.sequences.nudges.step_refuses_command_nudge import StepRefusesCommandNudge
from core.modules.sequences.nudges.sequence_unfinished_nudge import SequenceUnfinishedNudge


SEQUENCE_NUDGES = [StepWaitsNudge, StepEditBanNudge, SequenceStartedNudge, StepRefusesCommandNudge, SequenceUnfinishedNudge]
