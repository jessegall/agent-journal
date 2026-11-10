from dataclasses import dataclass

from engine.model.agent_scoped import AgentScoped
from engine.model.removable import Removable
from engine.model.environment_scoped import EnvironmentScoped

from engine.actor.actor import Actor
from engine.model.model import Model
from engine.errors.refusal import Refusal
from engine.time.timestamp import Timestamp
from core.modules.memories.models.lifecycles.memory_lifecycle import MemoryLifecycle
from core.modules.memories.models.enums.memory_state import MemoryState

LOWEST_WEIGHT = 0
HIGHEST_WEIGHT = 10
STARTING_WEIGHT = 5
TEXT_LIMIT_CHARACTERS = 400
FADING_REMOVAL_REASON = "faded to weight 0"


@dataclass(frozen=True, kw_only=True)
class Memory(Removable, AgentScoped, EnvironmentScoped, Model):
    """What the journal gives back to the agent that made it: a text with a weight from 0 to 10, given only above
    0, which fades.
    """

    model_name = "memory"
    cli_name = "memory"
    search_fields = ["text", "reason"]
    lifecycle = MemoryLifecycle
    table = "memories"

    environment_id: int = 0
    agent_id: int | None = None
    task_id: int | None = None
    creator_id: int
    text: str
    reason: str = ""
    weight: int = 5
    state: MemoryState = MemoryState.ACTIVE
    removed_at: Timestamp | None = None

    def __post_init__(self) -> None:
        if not LOWEST_WEIGHT <= self.weight <= HIGHEST_WEIGHT:
            raise Refusal(f"a weight is a whole number from {LOWEST_WEIGHT} to {HIGHEST_WEIGHT}, not {self.weight}")
        if not 1 <= len(self.text) <= TEXT_LIMIT_CHARACTERS:
            raise Refusal(f"a memory is 1 to {TEXT_LIMIT_CHARACTERS} characters, not {len(self.text)}", "say it in one or two plain sentences")

    def faded(self, timestamp: Timestamp, actor: Actor) -> "Memory":
        memory = self.changed(weight=max(LOWEST_WEIGHT, self.weight - 1))
        if memory.weight == LOWEST_WEIGHT:
            return memory.remove(timestamp, actor, FADING_REMOVAL_REASON)
        return memory

    def remove(self, timestamp: Timestamp, actor: Actor, reason: str) -> "Memory":
        return self.moved(MemoryLifecycle.remove, reason=reason, removed_at=timestamp)

    def restore(self, timestamp: Timestamp, actor: Actor) -> "Memory":
        return self.moved(MemoryLifecycle.restore, removed_at=None, reason="")
