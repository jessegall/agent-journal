from dataclasses import dataclass


@dataclass(frozen=True)
class SupervisorAnnouncement:
    """What an environment's supervisor announced in its inbox: its socket, where it mirrors the agent's screen, and the protocol it speaks; a datagram supervisor announces a bare path and speaks none."""

    socket: str
    screen: str = ""
    protocol: int = 0

    @classmethod
    def parsed(cls, data: dict) -> "SupervisorAnnouncement":
        return cls(**{name: data[name] for name in ("socket", "screen", "protocol") if name in data})

    @property
    def is_compatible(self) -> bool:
        return self.protocol > 0
