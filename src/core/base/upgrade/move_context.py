from collections.abc import Mapping
from dataclasses import dataclass, field


@dataclass(frozen=True)
class MoveContext:
    """What a move needs of the journal it moves into: the actor the moved rows are made by and the time they are
    stamped with."""

    core_actor_id: int
    timestamp: str
    project_folder: str = ""
    setting_keys: tuple[str, ...] = ()
    mark_variants: Mapping[str, str] = field(default_factory=lambda: {})
