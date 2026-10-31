from core.modules.settings.bindings.support.setting_values import SettingValues

SHORT_OUTPUT_SETTING = "processes.short-output"
FOREGROUND_SETTING = "processes.foreground-seconds"
WAITING_SETTING = "processes.foreground-while-waiting"
UNREAD_SETTING = "processes.unread-output-every"
DEFAULT_UNREAD_EVERY = 5
DEFAULT_SHORT_OUTPUT_BYTES = 200
DEFAULT_FOREGROUND_SECONDS = 30
DEFAULT_WAITING_SECONDS = 10


class ProcessSettings:
    """What the settings say about processes."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def short_output_bytes(self, environment_id: int) -> int:
        value = self.settings.value(SHORT_OUTPUT_SETTING, environment_id, DEFAULT_SHORT_OUTPUT_BYTES)
        return value if isinstance(value, int) and not isinstance(value, bool) else DEFAULT_SHORT_OUTPUT_BYTES

    def foreground_seconds(self, environment_id: int) -> int:
        return self.seconds(FOREGROUND_SETTING, environment_id, DEFAULT_FOREGROUND_SECONDS)

    def waiting_seconds(self, environment_id: int) -> int:
        return self.seconds(WAITING_SETTING, environment_id, DEFAULT_WAITING_SECONDS)

    def seconds(self, key: str, environment_id: int, default: int) -> int:
        value = self.settings.value(key, environment_id, default)
        return value if isinstance(value, int) and not isinstance(value, bool) and value >= 0 else default

    def unread_every(self, environment_id: int) -> int:
        return max(1, self.seconds(UNREAD_SETTING, environment_id, DEFAULT_UNREAD_EVERY))
