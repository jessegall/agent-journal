from core.base.registry.registry import Registry
from core.base.type_guards import is_list, is_tuple
from core.base.registry.helper_type_entry import HelperTypeEntry
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.agents.support.type_limits import TypeLimits

UNLIMITED_AGENT_COUNT = 0


class AgentTypeLimits:
    """Reads agent limits from settings, including any profile-specific limits."""

    def __init__(self, registry: Registry, settings: SettingValues) -> None:
        self.registry, self.settings = registry, settings

    def lookup(self, role: str, profile: str = "") -> TypeLimits | None:
        entry = next((entry for entry in self.registry.helper_types if entry.key == role), None)
        if entry is None or not entry.run_limit_key:
            return None
        return self.read(entry, profile)

    def read(self, entry: HelperTypeEntry, profile: str = "") -> TypeLimits:
        profile_limits = entry.profile_limits_key and self.profile_limits(entry.profile_limits_key, profile)
        return profile_limits or TypeLimits(self.settings.number(entry.run_limit_key), self.settings.number(entry.kept_limit_key))

    def profile_limits(self, key: str, profile: str) -> TypeLimits | None:
        stored = self.settings.value(key)
        for item in stored if is_list(stored) or is_tuple(stored) else ():
            name, _, numbers = str(item).partition(":")
            run, _, kept = numbers.partition(":")
            if name == profile and run.isdigit() and kept.isdigit():
                return TypeLimits(int(run), int(kept))
        return None
