from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class TunlerVersion:
    """The tunler on this machine, the newest its server offers, and whether an update waits."""

    current: str | None
    latest: str | None
    update_available: bool

    def json(self) -> Mapping[str, object]:
        return {"current": self.current, "latest": self.latest, "update_available": self.update_available}
