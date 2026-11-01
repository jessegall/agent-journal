from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

PLUGIN_LINE = NudgeDeclaration("plugins.plugin_line", NudgeType.REMARK, '{text}')
PLUGIN_REFUSAL = NudgeDeclaration("plugins.plugin_refusal", NudgeType.REFUSAL, '{text}')

PLUGIN_NUDGES = [PLUGIN_LINE, PLUGIN_REFUSAL]
