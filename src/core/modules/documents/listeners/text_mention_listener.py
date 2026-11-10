from typing import ClassVar

from engine.change.changed import RowChange
from engine.change.logged_event import LoggedEvent
from engine.change.deleted import Deleted
from engine.command.bus import Bus
from core.base.library.library_lookup import LibraryLookup
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.base.registry.registry import Registry
from engine.scope.actor_scope import ActorScope
from core.modules.documents.commands.record_mentions.record_mentions import RecordMentions
from core.modules.documents.references.row_ref import RowRef
from core.modules.documents.support.mention_refs import MentionRefs

MODULE_NAME = "journal.core.documents"


class TextMentionListener(CommitListener[RowChange]):
    """After a row's text is saved, on the deferred queue, links it to every row its text fields name. A save
    that changes no text field has nothing to link, and a row that follows an item of a team library is
    skipped, since its numbers mean something else in another journal."""

    text_fields: ClassVar[tuple[str, ...]] = ("title", "abstract", "body")
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, library: LibraryLookup, registry: Registry) -> None:
        self.bus, self.actors, self.queries, self.library, self.registry = bus, actors, queries, library, registry

    def handle(self, event: RowChange, logged: LoggedEvent) -> None:
        if isinstance(event, Deleted) or not (logged.is_creation or any(field in logged.data for field in self.text_fields)):
            return
        row = event.row
        texts = tuple(str(getattr(row, field)) for field in self.text_fields)
        if not any(MentionRefs.found(text, self.registry.models) for text in texts):
            return
        if self.library.is_copy(row.model_name, row.id):
            return
        self.bus.run(RecordMentions(RowRef(row.model_name, row.id), texts), self.actors.actor(MODULE_NAME), cause_id=logged.id)
