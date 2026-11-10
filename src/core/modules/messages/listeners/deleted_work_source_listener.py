from engine.event.deleted import Deleted
from engine.command.context import Context
from engine.listener.deletion_listener import DeletionListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.messages.models.enums.work_source_origin import WorkSourceOrigin
from core.modules.messages.models.message import Message
from core.modules.messages.models.message_work_source import MessageWorkSource


class DeletedWorkSourceListener(DeletionListener[Deleted[Message]]):
    """Clears the selections that point at a deleted message."""

    name = "messages.deleted-work-source"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Message], context: Context) -> None:
        for selected in tuple(self.queries.query(MessageWorkSource).filter(message_id=event.row.id).all_rows()):
            self.repository.update(selected, context, message_id=None, origin=WorkSourceOrigin.CLEAR, provisional=False, used=False)
