from typing import ClassVar

from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.model.tables import Tables
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.documents.commands.record_mentions import RecordMentions
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report

MODULE_NAME = "journal.core.documents"


class TextMentionListener(CommitListener):
    """After a document or report is saved, links it to every row its title, abstract or text names."""

    model: ClassVar[type[Doc] | type[Report]]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, tables: Tables) -> None:
        self.bus, self.actors, self.queries, self.tables = bus, actors, queries, tables

    def handle(self, event: LoggedEvent) -> None:
        rows = self.queries.query(self.model).filter(id=event.row_id).page(1, 1).rows
        if not rows:
            return
        text_row = rows[0]
        source = f"{self.tables.table(self.model).name}:{text_row.id}"
        self.bus.run(RecordMentions(source, "\n".join((text_row.title, text_row.abstract, text_row.body))), self.actors.actor(MODULE_NAME), cause_id=event.id,
                     environment_id=text_row.environment_id)
