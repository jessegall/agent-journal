from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

PLUGIN_REFUSAL = NudgeDeclaration("plugins.plugin_refusal", NudgeType.REFUSAL, "plugin:{plugin} refused: journal agent-line list")

PLUGIN_NUDGES = [PLUGIN_REFUSAL]
