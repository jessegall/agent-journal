from typing import ClassVar

from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.documents.commands.record_mentions import RecordMentions
from core.modules.documents.support.row_ref import RowRef
from core.modules.documents.models.text_row import TextRow

MODULE_NAME = "journal.core.documents"


class TextMentionListener(CommitListener):
    """After a document or report is saved, links it to every row its title, abstract or text names."""

    model: ClassVar[type[TextRow]]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: LoggedEvent) -> None:
        rows = self.queries.query(self.model).filter(id=event.row_id).page(1, 1).rows
        if not rows:
            return
        text_row = rows[0]
        source = RowRef(text_row.model_name, text_row.id)
        self.bus.run(RecordMentions(source, "\n".join((text_row.title, text_row.abstract, text_row.body))), self.actors.actor(MODULE_NAME), cause_id=event.id,
                     environment_id=text_row.environment_id)
