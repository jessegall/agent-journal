from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

PLUGIN_REFUSAL = NudgeDeclaration("plugins.plugin_refusal", NudgeType.REFUSAL, "plugin:{plugin} refused")
PLUGIN_PROGRAM_OFF = NudgeDeclaration("plugins.program_off", NudgeType.REFUSAL, "this program belongs to plugin {plugin}, which is switched off or not installed", id_field="plugin")

PLUGIN_NUDGES = [PLUGIN_PROGRAM_OFF, PLUGIN_REFUSAL]
