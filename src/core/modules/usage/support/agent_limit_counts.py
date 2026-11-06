from dataclasses import dataclass

from core.modules.usage.support.agent_profile_limit_counts import AgentProfileLimitCounts


@dataclass(frozen=True)
class AgentLimitCounts:
    key: str
    label: str
    running: int
    kept: int
    run_limit: int
    kept_limit: int
    run_setting: str
    kept_setting: str
    profile_specific: bool
    profiles: tuple[AgentProfileLimitCounts, ...]
    run_source: str
    kept_source: str
