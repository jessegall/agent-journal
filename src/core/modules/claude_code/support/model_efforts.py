from engine.setting.setting_values import SettingValues
from core.modules.claude_code.support.claude_code_settings import MODEL_EFFORTS

FALLBACK_EFFORT = "high"


class ModelEfforts:
    """The effort a Claude Code model starts at: the person's entry whose name the model id holds, else high."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def effort(self, model: str) -> str:
        pairs = (text.split(":", 1) for text in self.settings.texts(MODEL_EFFORTS) if ":" in text)
        return next((effort.strip() for name, effort in pairs if name.strip() and name.strip() in model), FALLBACK_EFFORT)
