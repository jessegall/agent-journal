from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field

from engine.driver.open_row import OpenRow


@dataclass(frozen=True)
class LoadedActor:
    """An agent as a hook reads it once: who it is, its suite and driver, the row its default states stand on (its
    launch), the default states it carries, and for a default taken away while another state is open, that state."""

    agent_id: int
    environment_id: int
    role: str
    access: str
    suite: str
    driver: str
    anchor: OpenRow
    defaults: Sequence[str] = ()
    removed_while: Mapping[str, str] = field(default_factory=dict[str, str])
