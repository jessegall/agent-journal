from engine.guard.guard import Guard
from engine.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from engine.registry.registry import Registry
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.chat.models.chat_mark import ChatMark
from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.command.context import Context


class MarkTypeGuard(Guard[Changed[ChatMark]]):
    """A mark is of a type an installed module declares, names a variant of that type, and is written only
    by the actor of the module that declares the type; a move such as end is not a write."""

    name = "chat.declared-type"

    def __init__(self, registry: Registry, rows: EventRows) -> None:
        self.registry, self.rows = registry, rows

    def check(self, event: Changed[ChatMark], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        mark, old = event.row, event.old_row
        if (old is not None and old.state is not mark.state):
            return
        declared = next((entry for entry in self.registry.marks if entry.type == mark.type), None)
        if declared is None:
            raise Refusal(f"no installed module declares the mark {mark.type}", "a module declares its mark types in its marks list")
        if mark.variant not in declared.variants:
            raise Refusal(f"the mark {mark.type} has no variant {mark.variant}", f"its variants are {', '.join(declared.variants)}")
        if self.rows.required(ActorRecord, context.actor.id).name != declared.module:
            raise Refusal(f"only {declared.module} writes a mark of {mark.type}", f"{declared.module} runs ShowMark from its own listener")
