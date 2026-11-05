from core.base.provider.provider import Provider
from core.base.scope.scopes import Scopes
from core.modules.helpers.support.helper_settings import ALLOWED_MODELS
from core.modules.settings.bindings.support.setting_values import SettingValues


class AllowedModels:
    """The models an agent's program may run in an environment."""

    def __init__(self, setting_values: SettingValues, scopes: Scopes) -> None:
        self.setting_values, self.scopes = setting_values, scopes

    def allowed(self, provider: Provider) -> list[str]:
        names = provider.model_names()
        listed = self.setting_values.texts(ALLOWED_MODELS)
        return [name for name in names if f"{provider.name} {name}" in listed] or names
