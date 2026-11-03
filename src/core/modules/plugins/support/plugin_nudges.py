from core.base.driver.nudge_declaration import NudgeDeclaration, AUTHORED_LINE_CHARACTERS
from core.base.driver.nudge_type import NudgeType

PLUGIN_LINE = NudgeDeclaration("plugins.plugin_line", NudgeType.INFO, '{text}', longest_characters=AUTHORED_LINE_CHARACTERS)
PLUGIN_REFUSAL = NudgeDeclaration("plugins.plugin_refusal", NudgeType.REFUSAL, '{text}', longest_characters=AUTHORED_LINE_CHARACTERS)

PLUGIN_NUDGES = [PLUGIN_LINE, PLUGIN_REFUSAL]
