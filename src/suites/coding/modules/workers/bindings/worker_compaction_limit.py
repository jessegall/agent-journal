from engine.setting.setting_values import SettingValues
from core.modules.drivers.support.compaction_limit import CompactionLimit
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS


class WorkerCompactionLimit(CompactionLimit):
    """The context size set for compacting agents, once the context limit is on."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def tokens(self) -> int | None:
        return self.settings.number(CONTEXT_LIMIT_TOKENS) if self.settings.flag(CONTEXT_LIMIT_ENABLED) else None
