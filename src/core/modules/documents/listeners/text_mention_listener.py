from typing import ClassVar

from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.library.library_lookup import LibraryLookup
from core.base.listener.commit_listener import CommitListener
from core.base.model.model import Model
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.documents.commands.record_mentions.record_mentions import RecordMentions
from core.modules.documents.support.row_ref import RowRef
from core.base.change.event_subscriber import E

MODULE_NAME = "journal.core.documents"


class TextMentionListener(CommitListener[E]):
    """After a row with text is saved, on the deferred queue, links it to every row its text fields name. A row that
    follows an item of a team library is skipped, since its numbers mean something else in another journal."""

    model: ClassVar[type[Model]]
    text_fields: ClassVar[tuple[str, ...]] = ("title", "abstract", "body")
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, library: LibraryLookup) -> None:
        self.bus, self.actors, self.queries, self.library = bus, actors, queries, library

    def handle(self, event: E, logged: LoggedEvent) -> None:
        rows = self.queries.query(self.model).filter(id=logged.row_id).page(1, 1).rows
        if not rows:
            return
        row = rows[0]
        if self.library.is_copy(row.model_name, row.id):
            return
        text = "\n".join(str(getattr(row, field)) for field in self.text_fields)
        self.bus.run(RecordMentions(RowRef(row.model_name, row.id), text), self.actors.actor(MODULE_NAME), cause_id=logged.id, environment_id=logged.environment_id)
