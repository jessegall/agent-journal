import shlex

from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.built_paths import BuiltPaths
from suites.coding.modules.workers.support.worker_settings import MERGE_BUILD_COMMAND, MERGE_BUILT_PATHS


class MergeBuilds:
    """The built files a merge leaves to a build and the command that builds them, as the workers settings name them."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def paths(self) -> BuiltPaths:
        return BuiltPaths(self.settings.texts(MERGE_BUILT_PATHS))

    def command(self) -> list[str]:
        return shlex.split(self.settings.text(MERGE_BUILD_COMMAND))
