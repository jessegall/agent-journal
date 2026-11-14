from collections.abc import Sequence
from dataclasses import dataclass

from engine.driver.open_row import OpenRow


@dataclass(frozen=True)
class LoadedActor:
    """An agent as a hook reads it once: who it is, its suite and driver, the row its default states stand on (its
    launch), and the default states it carries."""

    agent_id: int
    environment_id: int
    role: str
    access: str
    suite: str
    driver: str
    anchor: OpenRow
    defaults: Sequence[str] = ()
