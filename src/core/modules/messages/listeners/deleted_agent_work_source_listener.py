from engine.event.deleted import Deleted
from engine.command.context import Context
from engine.listener.deletion_listener import DeletionListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.messages.models.message_work_source import MessageWorkSource

WORK_SOURCES_REASON = "a deleted agent takes every work source it chose with it"


class DeletedAgentWorkSourceListener(DeletionListener[Deleted[Agent]]):
    """Removes the selections owned by a deleted agent."""

    name = "messages.deleted-agent-work-source"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Agent], context: Context) -> None:
        for selected in tuple(self.queries.query(MessageWorkSource).filter(agent_id=event.row.id).every_row(WORK_SOURCES_REASON)):
            self.repository.delete_stored(selected, context)
