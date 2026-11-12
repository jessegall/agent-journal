from engine.event.changed import Changed
from engine.command.context import Context
from engine.listener.deletion_listener import DeletionListener
from engine.model.model import Model
from engine.query.queries import Queries
from engine.query.conditions.among import Among
from engine.repository.repository import Repository
from core.modules.documents.models.link import Link
from collections.abc import Sequence

DELETED_LINKS_REASON = "a deleted row takes every link to or from it with it"
LINKS_READ_BATCH = 10000


class DeletedRowLinkListener(DeletionListener[Changed[Model]]):
    """Removes links at either end of any deleted rows, inside their deletion transaction; the links go together, so their own deletion reads the links of all of them at once."""

    name = "documents.deleted-row-links"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Changed[Model], context: Context) -> None:
        self.handle_many([event], context)

    def handle_many(self, events: Sequence[Changed[Model]], context: Context) -> None:
        if not events:
            return
        model = events[0].row.model_name
        ids = [event.row.id for event in events]
        for start in range(0, len(ids), LINKS_READ_BATCH):
            batch = ids[start:start + LINKS_READ_BATCH]
            outgoing = self.queries.query(Link).filter(source_model=model).matching(Among("source_id", batch)).every_row(DELETED_LINKS_REASON)
            incoming = self.queries.query(Link).filter(target_model=model).matching(Among("target_id", batch)).every_row(DELETED_LINKS_REASON)
            touching = {link.id: link for link in (*outgoing, *incoming)}
            self.repository.delete_many_stored(list(touching.values()), context)
