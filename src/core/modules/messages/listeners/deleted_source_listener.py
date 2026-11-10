from typing import ClassVar

from engine.change.deleted import Deleted
from engine.command.context import Context
from core.base.listener.deletion_listener import DeletionListener
from engine.model.model import Model
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.messages.models.message import Message


class DeletedSourceListener(DeletionListener[Deleted[Message]]):
    """Marks the request references to a deleted message unavailable in the rows of source_model."""

    source_model: ClassVar[type[Model]]

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Message], context: Context) -> None:
        sources = tuple(self.queries.query(self.source_model).filter(source_message_id=event.row.id, source_unavailable=False).all_rows())
        for source in sources:
            self.repository.update(source, context, source_unavailable=True)
