from dataclasses import dataclass

from engine.checkout.checkout import Checkout


@dataclass(frozen=True)
class AgentFacts:
    """What a plugin's event line says of the agent it came from: its role, the skills it has loaded and its
    checkout."""

    checkout: Checkout | None
    role: str = ""
    skills: tuple[str, ...] = ()
