from core.base.profile.agent_profile import AgentProfile
from core.base.provider.model_tier import ModelTier
from core.base.provider.provider import Provider
from core.modules.helpers.support.allowed_models import AllowedModels


class ProfileModels:
    """Chooses an allowed model from a requested tier, a profile's named models or its tier."""

    def __init__(self, allowed: AllowedModels) -> None:
        self.allowed = allowed

    def model(self, profile: AgentProfile, provider: Provider, tier: ModelTier | None) -> str:
        allowed = self.allowed.allowed(provider)
        if tier is not None:
            return provider.nearest_model(tier, allowed)
        profile_model = provider.profile_model(profile)
        if profile_model in allowed:
            return profile_model
        if profile.tier is not None:
            return provider.nearest_model(profile.tier, allowed)
        return provider.nearest_general_model(allowed)
