from dataclasses import dataclass


@dataclass(frozen=True)
class HookSource:
    path: str
    tracked: bool
