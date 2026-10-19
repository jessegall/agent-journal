from dataclasses import dataclass


@dataclass(frozen=True)
class TunlerVersion:
    current: str
    latest: str
    update_available: bool
