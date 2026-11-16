from dataclasses import dataclass


@dataclass(frozen=True)
class MainPlace:
    """A main agent's id, its environment, and whether its session runs: what the choice of the project
    environment reads."""

    id: int
    environment_id: int
    is_running: bool
