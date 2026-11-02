from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

PLUGIN_LINE_CHARACTERS = 2000
PLUGIN_LINE = NudgeDeclaration("plugins.plugin_line", NudgeType.REMARK, '{text}', longest_characters=PLUGIN_LINE_CHARACTERS)
PLUGIN_REFUSAL = NudgeDeclaration("plugins.plugin_refusal", NudgeType.REFUSAL, '{text}', longest_characters=PLUGIN_LINE_CHARACTERS)

PLUGIN_NUDGES = [PLUGIN_LINE, PLUGIN_REFUSAL]
