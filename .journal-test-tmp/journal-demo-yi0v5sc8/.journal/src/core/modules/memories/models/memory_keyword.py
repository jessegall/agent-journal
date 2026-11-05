from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class MemoryKeyword(Model):
    """One word that gives a memory back to an agent that names it while the memory is out of its context
    window."""

    model_name = "memory_keyword"
    cli_name = "memory-keyword"

    memory_id: int
    creator_id: int
    word: str
