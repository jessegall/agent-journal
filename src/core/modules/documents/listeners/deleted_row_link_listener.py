from engine.change.changed import Changed
from engine.command.context import Context
from engine.listener.deletion_listener import DeletionListener
from engine.model.model import Model
from engine.query.queries import Queries
from engine.query.conditions.among import Among
from engine.repository.repository import Repository
from core.modules.documents.models.link import Link
from collections.abc import Sequence


class DeletedRowLinkListener(DeletionListener[Changed[Model]]):
    """Removes links at either end of any deleted row, inside its deletion transaction."""

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
        for start in range(0, len(ids), 500):
            batch = ids[start:start + 500]
            outgoing = self.queries.query(Link).filter(source_model=model).matching(Among("source_id", batch)).all_rows()
            incoming = self.queries.query(Link).filter(target_model=model).matching(Among("target_id", batch)).all_rows()
            touching = {link.id: link for link in (*outgoing, *incoming)}
            for link in touching.values():
                self.repository.delete_stored(link, context)
