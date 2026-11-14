from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.profiles"
CLAUDE_MODEL_SETTING = f"{MODULE_KEY}.model-claude"
CODEX_MODEL_SETTING = f"{MODULE_KEY}.model-codex"
PROFILE_SETTINGS = [
    SettingValue("model-claude", "Model on Claude Code", "The default Claude Code model for built-in profiles. A profile can specify a different model.", SettingType.TEXT, default="sonnet", scope=SettingScope.PROJECT),
    SettingValue("model-codex", "Model on Codex", "The default Codex model for built-in profiles.", SettingType.TEXT, default="gpt-6.1-sol", scope=SettingScope.PROJECT),
]
