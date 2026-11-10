from collections.abc import Mapping
from dataclasses import dataclass, replace
from typing import Any

from engine.profile.agent_profile import AgentProfile


@dataclass(frozen=True)
class ProfileEntry:
    """An agent profile and the module that registered it."""

    module: str
    profile: AgentProfile

    @classmethod
    def declared(cls, module: str, profile: AgentProfile) -> "ProfileEntry":
        return cls(module, replace(profile, module=module))

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "ProfileEntry":
        return cls(stored["module"], AgentProfile.parsed(stored["profile"]))
