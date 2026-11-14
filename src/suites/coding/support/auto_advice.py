from engine.setting.setting_values import SettingValues
from suites.coding.support.coding_settings import WRITES_CODE_SETTING


class AutoAdvice:
    """What a refused main agent is told to do instead, read from the code-writing switch now in force: while
    it writes code it may do the work itself, otherwise it writes no project file and can only send the
    work on."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def without_helpers(self) -> str:
        return "do the work yourself or send it to a worker" if self.settings.flag(WRITES_CODE_SETTING) else "send the work to a worker"

    def without_workers(self) -> str:
        if self.settings.flag(WRITES_CODE_SETTING):
            return "main-dispatches-workers is off, so do the task yourself"
        return "the main agent writes no code here either: ask a user to allow workers"
