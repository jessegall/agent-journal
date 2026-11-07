from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.listener.deletion_listener import DeletionListener
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.messages.models.message_work_source import MessageWorkSource


class DeletedAgentWorkSourceListener(DeletionListener[Deleted[Agent]]):
    """Removes the selections owned by a deleted agent."""

    name = "messages.deleted-agent-work-source"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Agent], context: Context) -> None:
        for selected in tuple(self.queries.query(MessageWorkSource).filter(agent_id=event.row.id).all_rows()):
            self.repository.delete_stored(selected, context)
