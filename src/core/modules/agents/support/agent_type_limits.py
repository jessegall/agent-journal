from dataclasses import dataclass

from core.base.registry.registry import Registry
from core.modules.settings.bindings.support.setting_values import SettingValues

NO_LIMIT = 0


@dataclass(frozen=True)
class TypeLimits:
    """How many agents of one type may run at once, and how many are kept. A kept limit of 0 means no limit."""

    run: int
    kept: int


class AgentTypeLimits:
    """The one place that reads the run and kept limits of a type of agent, through the settings its agent type
    declares. A profile's own entry wins for that profile, as profile:run:kept in a setting a person sets, and numbers
    in a profile's file are never read, since an agent can edit that file."""

    def __init__(self, registry: Registry, settings: SettingValues) -> None:
        self.registry, self.settings = registry, settings

    def of(self, role: str, profile: str = "") -> TypeLimits | None:
        entry = next((entry for entry in self.registry.agent_types if entry.key == role), None)
        if entry is None or not entry.run_limit_key:
            return None
        profile_limits = entry.profile_limits_key and self.profile_limits(entry.profile_limits_key, profile)
        return profile_limits or TypeLimits(self.settings.number(entry.run_limit_key), self.settings.number(entry.kept_limit_key))

    def profile_limits(self, key: str, profile: str) -> TypeLimits | None:
        for item in self.settings.value(key) or ():
            name, _, numbers = str(item).partition(":")
            run, _, kept = numbers.partition(":")
            if name == profile and run.isdigit() and kept.isdigit():
                return TypeLimits(int(run), int(kept))
        return None
