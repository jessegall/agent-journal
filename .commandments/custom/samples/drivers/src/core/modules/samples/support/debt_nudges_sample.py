from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

# @sin architecture_nudges_instruction_without_payment
LINE_WITHOUT_COMMAND = NudgeDeclaration("samples.without_command", NudgeType.INSTRUCTION, "name it with journal output title {process}")
# @righteous architecture_nudges_instruction_without_payment
LINE_WITH_COMMAND = NudgeDeclaration("samples.with_command", NudgeType.INSTRUCTION, "name it with journal output title {process}", required_command="journal output title {process}")
# @righteous architecture_nudges_instruction_without_payment
LINE_WITH_EMPTY_COMMAND = NudgeDeclaration("samples.empty_command", NudgeType.INSTRUCTION, "see journal output read {process}", required_command="")
# @righteous architecture_nudges_instruction_without_payment
NOTICE_LINE =NudgeDeclaration("samples.asks_nothing", NudgeType.NOTICE, "see journal output read {process}")
