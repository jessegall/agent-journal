from typing import ClassVar

from core.base.change.logged_event import LoggedEvent
from core.base.change.deleted import Deleted
from core.base.command.bus import Bus
from core.base.library.library_lookup import LibraryLookup
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.documents.commands.record_mentions.record_mentions import RecordMentions
from core.modules.documents.references.row_ref import RowRef
from core.base.change.event_subscriber import E

MODULE_NAME = "journal.core.documents"


class TextMentionListener(CommitListener[E]):
    """After a row's text is saved, on the deferred queue, links it to every row its text fields name. A save that
    changes no text field has nothing to link, and a row that follows an item of a team library is skipped, since
    its numbers mean something else in another journal."""

    text_fields: ClassVar[tuple[str, ...]] = ("title", "abstract", "body")
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, library: LibraryLookup) -> None:
        self.bus, self.actors, self.queries, self.library = bus, actors, queries, library

    def handle(self, event: E, logged: LoggedEvent) -> None:
        if isinstance(event, Deleted) or not (logged.is_creation or any(field in logged.data for field in self.text_fields)):
            return
        row = event.row
        if self.library.is_copy(row.model_name, row.id):
            return
        texts = tuple(str(getattr(row, field)) for field in self.text_fields)
        self.bus.run(RecordMentions(RowRef(row.model_name, row.id), texts), self.actors.actor(MODULE_NAME), cause_id=logged.id)
