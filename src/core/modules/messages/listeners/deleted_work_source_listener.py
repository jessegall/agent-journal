from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.listener.deletion_listener import DeletionListener
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.messages.models.enums.work_source_origin import WorkSourceOrigin
from core.modules.messages.models.message import Message
from core.modules.messages.models.message_work_source import MessageWorkSource


class DeletedWorkSourceListener(DeletionListener[Deleted[Message] | Deleted[Agent]]):
    """Clears a deleted message selection and removes selections owned by a deleted agent."""

    name = "messages.deleted-work-source"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Message] | Deleted[Agent], context: Context) -> None:
        row = event.row
        if isinstance(row, Agent):
            for selected in tuple(self.queries.query(MessageWorkSource).filter(agent_id=row.id).all_rows()):
                self.repository.delete_stored(selected, context)
            return
        for selected in tuple(self.queries.query(MessageWorkSource).filter(message_id=row.id).all_rows()):
            self.repository.update(selected, context, message_id=None, origin=WorkSourceOrigin.CLEAR, provisional=False, used=False)
