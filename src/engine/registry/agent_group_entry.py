from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from engine.agent.agent_group import AgentGroup


@dataclass(frozen=True)
class AgentGroupEntry:
    """An agent group and the module that registered it."""

    module: str
    key: str
    label: str
    agent_type: str
    profiles: tuple[str, ...] = ()

    @classmethod
    def declared(cls, module: str, declaration: AgentGroup) -> "AgentGroupEntry":
        return cls(module, declaration.key, declaration.label, declaration.agent_type, tuple(declaration.profiles))

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "AgentGroupEntry":
        return cls(stored["module"], stored["key"], stored["label"], stored["agent_type"], tuple(stored.get("profiles", ())))
