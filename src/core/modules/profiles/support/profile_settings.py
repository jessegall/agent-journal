from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.profiles"
CLAUDE_MODEL_SETTING = f"{MODULE_KEY}.model-claude"
CODEX_MODEL_SETTING = f"{MODULE_KEY}.model-codex"
PROFILE_SETTINGS = [
    SettingValue("model-claude", "Model on Claude Code", "The model the journal's own profiles run on with Claude Code, unless a profile names its own.", SettingType.TEXT, default="sonnet", scope=SettingScope.PROJECT),
    SettingValue("model-codex", "Model on Codex", "The model the journal's own profiles run on with Codex.", SettingType.TEXT, default="gpt-6.1-sol", scope=SettingScope.PROJECT),
]
