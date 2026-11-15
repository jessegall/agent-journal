from dataclasses import dataclass


@dataclass(frozen=True)
class LoadedActor:
    """An agent as a hook reads it once: who it is, and its suite and driver."""

    agent_id: int
    environment_id: int
    role: str
    access: str
    suite: str
    driver: str
