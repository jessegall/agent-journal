from engine.errors.refusal import Refusal
from core.modules.helpers.support.agent_options import AgentOptions
from core.modules.helpers.support.helper_settings import ALLOWED_MODELS
from core.modules.settings.bindings.support.setting_values import SettingValues


class AgentAdmission:
    """Whether an agent type and profile may start, resume or use a provider and model. Every restriction has
    to allow it: the agent options of the type and profile, then the allowed models of the environment. A
    list that is set and empty allows nothing, one that is not set allows everything, and a preference
    never widens a restriction."""

    def __init__(self, options: AgentOptions, settings: SettingValues) -> None:
        self.options, self.settings = options, settings

    def new_reasons(self, agent_type: str, profile: str = "") -> list[str]:
        resolved = self.options.resolved(agent_type, profile)
        reasons = list(resolved.problems)
        if not resolved.options.allow_new:
            reasons.append(f"new {agent_type} sessions are switched off")
        if resolved.options.allowed_profiles is not None and profile not in resolved.options.allowed_profiles:
            reasons.append(f"{agent_type} may not use the profile {profile}")
        return reasons

    def resume_reasons(self, agent_type: str, profile: str = "") -> list[str]:
        resolved = self.options.resolved(agent_type, profile)
        reasons = list(resolved.problems)
        if not resolved.options.allow_resume:
            reasons.append(f"stopped {agent_type} sessions may not resume")
        return reasons

    def provider_reasons(self, agent_type: str, profile: str, provider: str) -> list[str]:
        allowed = self.options.resolved(agent_type, profile).options.allowed_providers
        return [] if allowed is None or provider in allowed else [f"{agent_type} may not use {provider}"]

    def checked_provider(self, agent_type: str, profile: str, provider: str) -> None:
        self.refuse(self.provider_reasons(agent_type, profile, provider), "choose a program the agent options allow")

    def model_reasons(self, agent_type: str, profile: str, provider: str, model: str) -> list[str]:
        options = self.options.resolved(agent_type, profile).options
        reasons = self.provider_reasons(agent_type, profile, provider)
        if options.allowed_models is not None and f"{provider}:{model}" not in options.allowed_models:
            reasons.append(f"{agent_type} may not use {provider} {model}")
        environment_models = self.settings.texts(ALLOWED_MODELS)
        if environment_models and f"{provider} {model}" not in environment_models:
            reasons.append(f"{provider} {model} is not among the allowed models of the environment")
        return reasons

    def checked_new(self, agent_type: str, profile: str = "") -> None:
        self.refuse(self.new_reasons(agent_type, profile), "change the agent options in the settings")

    def checked_resume(self, agent_type: str, profile: str = "") -> None:
        self.refuse(self.resume_reasons(agent_type, profile), "change the agent options in the settings")

    def checked_model(self, agent_type: str, profile: str, provider: str, model: str) -> None:
        self.refuse(self.model_reasons(agent_type, profile, provider, model), "choose a model the restrictions allow")

    @staticmethod
    def refuse(reasons: list[str], suggestion: str) -> None:
        if reasons:
            raise Refusal("; ".join(reasons), suggestion)
