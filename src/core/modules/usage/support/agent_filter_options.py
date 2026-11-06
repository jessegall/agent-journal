from dataclasses import dataclass


@dataclass(frozen=True)
class AgentFilterOptions:
    roles: tuple[str, ...]
    profiles: tuple[tuple[str, str], ...]
