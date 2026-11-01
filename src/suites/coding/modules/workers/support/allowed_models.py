from core.base.provider.provider import Provider
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import ALLOWED_MODELS


class AllowedModels:
    """The models a worker may run on, and the one it gets: the program's general model, or the allowed model
    nearest to it."""

    def __init__(self, setting_values: SettingValues) -> None:
        self.setting_values = setting_values

    def allowed(self, provider: Provider, environment_id: int | None) -> list[str]:
        names = provider.model_names()
        listed = self.setting_values.texts(ALLOWED_MODELS, environment_id)
        return [name for name in names if f"{provider.name} {name}" in listed] or names

    def worker_model(self, provider: Provider, environment_id: int | None) -> str:
        return provider.nearest_general_model(self.allowed(provider, environment_id))
