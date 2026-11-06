from core.base.change.changed import Changed
from core.base.command.context import Context
from core.base.listener.deletion_listener import DeletionListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.documents.models.link import Link


class DeletedRowLinkListener(DeletionListener[Changed[Model]]):
    """Removes links at either end of any deleted row, inside its deletion transaction."""

    name = "documents.deleted-row-links"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Changed[Model], context: Context) -> None:
        row = event.row
        outgoing = self.queries.query(Link).filter(source_model=row.model_name, source_id=row.id).all_rows()
        incoming = self.queries.query(Link).filter(target_model=row.model_name, target_id=row.id).all_rows()
        touching = {link.id: link for link in (*outgoing, *incoming)}
        for link in touching.values():
            self.repository.delete_stored(link, context)
