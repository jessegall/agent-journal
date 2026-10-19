from dataclasses import dataclass, field


@dataclass(frozen=True)
class TunnelCause:
    """Why the tunnel does not answer, for the viewer: host, stopped, old, waiting or open, in words, with the last lines the tunnel wrote when it stopped."""

    cause: str
    text: str
    lines: list[str] = field(default_factory=list)
