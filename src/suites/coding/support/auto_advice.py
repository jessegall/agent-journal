from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.support.coding_settings import AUTO_MODE_SETTING


class AutoAdvice:
    """What a refused main agent is told to do instead, read from the Auto setting now in force: with Auto on it may
    write the code itself, with Auto off it writes no project file and can only send the work on."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def without_helpers(self) -> str:
        return "do the work yourself or send it to a worker" if self.settings.flag(AUTO_MODE_SETTING) else "send the work to a worker"

    def without_workers(self) -> str:
        if self.settings.flag(AUTO_MODE_SETTING):
            return "builder-dispatches-workers is off, so do the task yourself"
        return "auto mode is off too: ask a person to allow workers"
