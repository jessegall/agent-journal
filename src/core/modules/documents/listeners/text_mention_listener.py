from typing import ClassVar

from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.library.library_lookup import LibraryLookup
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.documents.commands.record_mentions.record_mentions import RecordMentions
from core.modules.documents.support.row_ref import RowRef
from core.modules.documents.models.text_row import TextRow

MODULE_NAME = "journal.core.documents"


class TextMentionListener(CommitListener):
    """After a document or report is saved, links it to every row its title, abstract or text names. A row that
    follows an item of a team library is skipped, since its numbers mean something else in another journal."""

    model: ClassVar[type[TextRow]]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, library: LibraryLookup) -> None:
        self.bus, self.actors, self.queries, self.library = bus, actors, queries, library

    def handle(self, event: LoggedEvent) -> None:
        rows = self.queries.query(self.model).filter(id=event.row_id).page(1, 1).rows
        if not rows:
            return
        text_row = rows[0]
        if self.library.is_copy(text_row.model_name, text_row.id):
            return
        source = RowRef(text_row.model_name, text_row.id)
        self.bus.run(RecordMentions(source, "\n".join((text_row.title, text_row.abstract, text_row.body))), self.actors.actor(MODULE_NAME), cause_id=event.id,
                     environment_id=event.environment_id)
