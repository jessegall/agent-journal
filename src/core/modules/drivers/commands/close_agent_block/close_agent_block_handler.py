from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock


class CloseAgentBlockHandler(Handler[CloseAgentBlock, AgentBlock]):
    """Keeps when a block ended."""

    command = CloseAgentBlock

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: CloseAgentBlock, context: Context) -> AgentBlock:
        return self.repository.save(self.queries.query(AgentBlock).find(command.agent_block_id).changed(closed_at=context.timestamp), context)
