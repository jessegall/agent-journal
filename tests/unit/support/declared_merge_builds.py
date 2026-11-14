from suites.coding.modules.workers.support.merge_builds import MergeBuilds
from suites.coding.modules.workers.support.worker_settings import MODULE_KEY, WORKER_SETTING_VALUES


class WorkerSettingsDeclarations:
    """Answers each workers setting with the default it is declared with, as a project that set none of them."""

    def value(self, key: str) -> object:
        return next(setting.default for setting in WORKER_SETTING_VALUES if f"{MODULE_KEY}.{setting.key}" == key)

    def text(self, key: str) -> str:
        return str(self.value(key))

    def texts(self, key: str) -> tuple[str, ...]:
        return tuple(str(item) for item in self.value(key))


def declared_merge_builds() -> MergeBuilds:
    return MergeBuilds(WorkerSettingsDeclarations())
