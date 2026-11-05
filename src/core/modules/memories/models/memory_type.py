from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class MemoryType(Model):
    """A type of memory: its starting weight, and whether it is given at a session start, at a context mark and
    by keyword.
    """

    model_name = "memory_type"
    cli_name = "memory-type"

    creator_id: int
    name: str
    module: str
    description: str
    starting_weight: int = 5
    start_delivery: bool = True
    mark_delivery: bool = False
    keyword_delivery: bool = True
