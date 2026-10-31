from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class MemoryType(Model):
    """A type of memory: whether agents may make it (the user always may), whether each compaction lowers its
    weight, its starting weight, and whether it is given at a session start, at a context mark and by keyword."""

    model_name = "memory_type"
    cli_name = "memory-type"

    creator_id: int
    name: str
    module: str
    description: str
    agent_writable: bool
    fades: bool
    starting_weight: int = 5
    start_giving: bool = True
    mark_giving: bool = False
    keyword_giving: bool = True
