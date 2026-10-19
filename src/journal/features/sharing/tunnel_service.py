from dataclasses import dataclass


@dataclass(frozen=True)
class TunnelService:
    """The tunnel as the viewer lists a service: its name, ready, starting or stopped, why, and where its inspector answers."""

    id: str
    state: str
    why: str
    url: str
