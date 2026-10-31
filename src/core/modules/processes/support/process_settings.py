from core.modules.settings.bindings.support.setting_values import SettingValues

SHORT_OUTPUT_SETTING = "processes.short-output"
DEFAULT_SHORT_OUTPUT_BYTES = 200


class ProcessSettings:
    """What the settings say about processes."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def short_output_bytes(self, environment_id: int) -> int:
        value = self.settings.value(SHORT_OUTPUT_SETTING, environment_id, DEFAULT_SHORT_OUTPUT_BYTES)
        return value if isinstance(value, int) and not isinstance(value, bool) else DEFAULT_SHORT_OUTPUT_BYTES
