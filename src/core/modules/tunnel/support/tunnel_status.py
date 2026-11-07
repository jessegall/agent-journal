from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class TunnelStatus:
    """What the tunnel window draws: whether the tunnel is connected, its address, and why not when it is not.
    """

    state: str
    address: str | None
    reason: str

    def json(self) -> Mapping[str, object]:
        return {"state": self.state, "address": self.address, "reason": self.reason}
