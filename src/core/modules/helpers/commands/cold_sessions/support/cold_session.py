from dataclasses import dataclass


@dataclass(frozen=True)
class ColdSession:
    session: str
    context_percent: int
