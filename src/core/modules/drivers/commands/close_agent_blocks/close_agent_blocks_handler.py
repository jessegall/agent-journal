from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.close_agent_blocks.close_agent_blocks import CloseAgentBlocks
from core.modules.drivers.models.agent_block import AgentBlock


class CloseAgentBlocksHandler(Handler[CloseAgentBlocks, None]):
    """Ends each of the blocks that is still open, in one read of them all; one closed in the meantime
    stays as it is."""

    command = CloseAgentBlocks

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: CloseAgentBlocks, context: Context) -> None:
        for block in self.queries.query(AgentBlock).find_many(list(command.agent_block_ids)):
            if block.closed_at is None:
                self.repository.update(block, context, closed_at=context.timestamp)
