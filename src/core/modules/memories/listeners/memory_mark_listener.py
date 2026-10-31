from enum import StrEnum

from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.modules.chat.commands.show_mark import ShowMark
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant

MEMORIES_MODULE = "journal.core.memories"


class MemoryMarkListener(CommitListener):
    """What the memory mark listeners share: showing one mark, as the memories module, for the event that caused it,
    keyed by the event so a listener run twice for one event leaves one mark."""

    def __init__(self, bus: Bus, actors: ModuleActors) -> None:
        self.bus, self.actors = bus, actors

    def show(self, event: LoggedEvent, variant: MemoryMarkVariant, text: str, type: StrEnum = MemoryMarkType.MEMORY, environment_id: int | None = None,
             agent_id: int | None = None, row_model: str = "memory", row_id: int | None = None) -> None:
        environment_id = environment_id or event.environment_id
        if environment_id is None:
            return
        key = f"{variant.value}:{event.row_id}:{event.id}"
        self.bus.run(ShowMark(environment_id, type, variant, key, text, agent_id=agent_id, row_model=row_model, row_id=row_id, ended=True),
                     self.actors.actor(MEMORIES_MODULE), cause_id=event.id, environment_id=environment_id)
