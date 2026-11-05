from core.base.provider.provider import Provider
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import ALLOWED_MODELS


class AllowedModels:
    """The models a worker's program may run in an environment."""

    def __init__(self, setting_values: SettingValues) -> None:
        self.setting_values = setting_values

    def allowed(self, provider: Provider, environment_id: int | None) -> list[str]:
        names = provider.model_names()
        listed = self.setting_values.texts(ALLOWED_MODELS, environment_id)
        return [name for name in names if f"{provider.name} {name}" in listed] or names

