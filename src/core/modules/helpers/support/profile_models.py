from core.base.profile.agent_profile import AgentProfile
from core.base.profile.model_tier import ModelTier
from engine.provider.provider import Provider
from core.modules.helpers.support.agent_options import AgentOptions
from core.modules.helpers.support.allowed_models import AllowedModels


class ProfileModels:
    """Chooses an allowed model from a requested tier, the model default of the agent options, a profile's named
    models or its tier."""

    def __init__(self, allowed: AllowedModels, options: AgentOptions) -> None:
        self.allowed, self.options = allowed, options

    def model(self, profile: AgentProfile, provider: Provider, tier: ModelTier | None, agent_type: str = "") -> str:
        allowed = self.allowed.models_allowed(provider, agent_type, profile.name)
        if tier is not None:
            return provider.nearest_model(tier, allowed)
        default = self.option_default(profile, provider, agent_type)
        if default in allowed:
            return default
        profile_model = provider.profile_model(profile)
        if profile_model in allowed:
            return profile_model
        if profile.tier is not None:
            return provider.nearest_model(profile.tier, allowed)
        return provider.nearest_general_model(allowed)

    def option_default(self, profile: AgentProfile, provider: Provider, agent_type: str) -> str:
        if not agent_type:
            return ""
        defaults = self.options.resolved(agent_type, profile.name).options.model_defaults or ()
        return next((default.split(":", 1)[1] for default in defaults if default.startswith(f"{provider.name}:")), "")
