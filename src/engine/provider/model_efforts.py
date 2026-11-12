from engine.setting.setting_values import SettingValues


class ModelEfforts:
    """The effort a program's model starts at: the entry of the program's model:effort list whose name the model id
    holds, or none when no entry names it."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def effort(self, setting_key: str, model: str) -> str | None:
        pairs = (text.split(":", 1) for text in self.settings.texts(setting_key) if ":" in text)
        return next((effort.strip() for name, effort in pairs if name.strip() and name.strip() in model), None)
