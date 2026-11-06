from dataclasses import dataclass


@dataclass(frozen=True)
class StopCheck:
    rule: str
    outcome: str
    reason: str
    applied: bool
    layer: str | None = None
