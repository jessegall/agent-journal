from engine.provider.provider import Provider
from engine.scope.scopes import Scopes
from core.modules.helpers.support.agent_options import AgentOptions
from core.modules.helpers.support.helper_settings import ALLOWED_MODELS
from engine.setting.setting_values import SettingValues


class AllowedModels:
    """The models an agent's program may run in an environment. A configured list that names none of the
    program's models allows none. Given an agent type and profile, the agent options of that type and
    profile narrow it further."""

    def __init__(self, setting_values: SettingValues, scopes: Scopes, options: AgentOptions) -> None:
        self.setting_values, self.scopes, self.options = setting_values, scopes, options

    def allowed(self, provider: Provider) -> list[str]:
        names = provider.model_names()
        listed = self.setting_values.texts(ALLOWED_MODELS)
        return [name for name in names if f"{provider.name} {name}" in listed] if listed else names

    def models_allowed(self, provider: Provider, agent_type: str, profile: str) -> list[str]:
        names = self.allowed(provider)
        options = self.options.resolved(agent_type, profile).options
        if options.allowed_providers is not None and provider.name not in options.allowed_providers:
            return []
        if options.allowed_models is None:
            return names
        return [name for name in names if f"{provider.name}:{name}" in options.allowed_models]
