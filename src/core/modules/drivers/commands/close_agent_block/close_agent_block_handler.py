from core.base.command.context import Context
from core.base.command.completed_command_error import CompletedCommandError
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock


class CloseAgentBlockHandler(Handler[CloseAgentBlock, AgentBlock]):
    """Keeps when a block ended and why it was skipped; only a block with a grace, or one declared skippable, is skipped, and a block ends once."""

    command = CloseAgentBlock

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: CloseAgentBlock, context: Context) -> AgentBlock:
        block = self.queries.query(AgentBlock).find(command.agent_block_id)
        if block.closed_at is not None:
            raise CompletedCommandError(f"agent_block {block.id} is settled already")
        if command.skip_reason and block.grace is None and not block.is_skippable:
            raise Refusal(f"agent_block {block.id} cannot be skipped", "run what it waits for, or answer what it waits on")
        return self.repository.update(block, context, closed_at=context.timestamp, skip_reason=command.skip_reason)
