from core.base.provider.provider import Provider
from core.base.scope.scopes import Scopes
from core.modules.helpers.support.agent_options import AgentOptions
from core.modules.helpers.support.helper_settings import ALLOWED_MODELS
from core.modules.settings.bindings.support.setting_values import SettingValues


class AllowedModels:
    """The models an agent's program may run in an environment. A configured list that names none of the program's
    models allows none. Given an agent type and profile, the agent options of that type and profile narrow it further."""

    def __init__(self, setting_values: SettingValues, scopes: Scopes, options: AgentOptions) -> None:
        self.setting_values, self.scopes, self.options = setting_values, scopes, options

    def allowed(self, provider: Provider, agent_type: str = "", profile: str = "") -> list[str]:
        names = provider.model_names()
        listed = self.setting_values.texts(ALLOWED_MODELS)
        if listed:
            names = [name for name in names if f"{provider.name} {name}" in listed]
        if not agent_type:
            return names
        options = self.options.reading(agent_type, profile).options
        if options.allowed_providers is not None and provider.name not in options.allowed_providers:
            return []
        if options.allowed_models is None:
            return names
        return [name for name in names if f"{provider.name}:{name}" in options.allowed_models]
