from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import MERGE_HOOKS

ENTRY_SEPARATOR = ":"


class MergeHooks:
    """The commands a helper profile runs after a worker of that profile is merged: the entries profile: command
    of the merge hooks setting, in their order."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def commands(self, profile: str) -> tuple[str, ...]:
        entries = (text.partition(ENTRY_SEPARATOR) for text in self.settings.texts(MERGE_HOOKS))
        return tuple(command.strip() for name, _, command in entries if name.strip() == profile and command.strip())
