from dataclasses import dataclass

from core.base.actor import Actor
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.base.timestamp import Timestamp
from core.modules.memories.memory_lifecycle import MemoryLifecycle
from core.modules.memories.memory_state import MemoryState

LOWEST_WEIGHT = 0
HIGHEST_WEIGHT = 10
TEXT_LIMIT_CHARACTERS = 400


@dataclass(frozen=True, kw_only=True)
class Memory(Model):
    """What the journal gives back to an agent: for one environment, for one helper with agent_id, or for the
    whole project with neither; a weight from 0 to 10, given only above 0; quiet until due_at when it has one."""

    model_name = "memory"
    cli_name = "memory"
    lifecycle = MemoryLifecycle
    table = "memories"

    environment_id: int | None = None
    agent_id: int | None = None
    task_id: int | None = None
    creator_id: int
    type: str
    text: str
    reason: str = ""
    weight: int = 5
    state: MemoryState = MemoryState.ACTIVE
    due_at: Timestamp | None = None
    removed_at: Timestamp | None = None

    def __post_init__(self) -> None:
        if not LOWEST_WEIGHT <= self.weight <= HIGHEST_WEIGHT:
            raise Refusal(f"a weight is a whole number from {LOWEST_WEIGHT} to {HIGHEST_WEIGHT}, not {self.weight}")
        if not 1 <= len(self.text) <= TEXT_LIMIT_CHARACTERS:
            raise Refusal(f"a memory is 1 to {TEXT_LIMIT_CHARACTERS} characters, not {len(self.text)}", "say it in one or two plain sentences")

    def faded(self) -> "Memory":
        return self.changed(weight=max(LOWEST_WEIGHT, self.weight - 1))

    def weighed(self, weight: int) -> "Memory":
        return self.changed(weight=weight)

    def remove(self, timestamp: Timestamp, actor: Actor, reason: str) -> "Memory":
        return self.moved(MemoryLifecycle.remove, reason=reason, removed_at=timestamp)

    def restore(self, timestamp: Timestamp, actor: Actor) -> "Memory":
        return self.moved(MemoryLifecycle.restore, removed_at=None, reason="")
