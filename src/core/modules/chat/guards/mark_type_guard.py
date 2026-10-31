from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.chat.models.chat_mark import ChatMark


class MarkTypeGuard(Guard):
    """A mark is of a type an installed module declares, names a variant of that type, and is written only by the
    actor of the module that declares the type; a move such as end is not a write."""

    name = "chat.declared-type"
    event = "chat_mark.*"

    def __init__(self, registry: Registry, queries: Queries) -> None:
        self.registry, self.queries = registry, queries

    def check(self, change: Change[Model]) -> None:
        mark, old = change.new_row, change.old_row
        if not isinstance(mark, ChatMark) or (isinstance(old, ChatMark) and old.state is not mark.state):
            return
        declared = next((entry for entry in self.registry.marks if entry.type == mark.type), None)
        if declared is None:
            raise Refusal(f"no installed module declares the mark {mark.type}", "a module declares its mark types in its marks list")
        if mark.variant not in declared.variants:
            raise Refusal(f"the mark {mark.type} has no variant {mark.variant}", f"its variants are {', '.join(declared.variants)}")
        if self.queries.query(ActorRecord).find(change.actor.id).name != declared.module:
            raise Refusal(f"only {declared.module} writes a mark of {mark.type}", f"{declared.module} runs ShowMark from its own listener")
