from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

# @sin architecture_nudges_InstructionDeclaresWhatPaysItDetector
LINE_WITHOUT_COMMAND = NudgeDeclaration("samples.without_command", NudgeType.INSTRUCTION, "name it with journal output title {process}")
# @righteous architecture_nudges_InstructionDeclaresWhatPaysItDetector
LINE_WITH_COMMAND = NudgeDeclaration("samples.with_command", NudgeType.INSTRUCTION, "name it with journal output title {process}", pays="journal output title {process}")
# @righteous architecture_nudges_InstructionDeclaresWhatPaysItDetector
ADVICE_LINE = NudgeDeclaration("samples.advice", NudgeType.INSTRUCTION, "see journal output read {process}", pays="")
# @righteous architecture_nudges_InstructionDeclaresWhatPaysItDetector
REMARK_LINE = NudgeDeclaration("samples.remark", NudgeType.REMARK, "see journal output read {process}")
