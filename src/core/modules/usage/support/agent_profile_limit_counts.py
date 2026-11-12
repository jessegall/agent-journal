from dataclasses import dataclass


@dataclass(frozen=True)
class AgentProfileLimitCounts:
    profile: str
    title: str
    running: int
    kept: int
    run_limit: int
    kept_limit: int
    group: str = ""
    line: str = ""
