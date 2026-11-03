from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.models.agent_block import AgentBlock
from core.base.driver.block_until import BlockUntil


class BlockUntilHandler(Handler[BlockUntil, AgentBlock]):
    """Opens a block, or brings the open one with the same line up to date with its words."""

    command = BlockUntil

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: BlockUntil, context: Context) -> AgentBlock:
        open_blocks = self.queries.query(AgentBlock).filter(agent_id=command.agent_id, nudge_key=command.nudge.key).matching(IsNull("closed_at")).page(1, 1).rows
        if open_blocks:
            return self.repository.save(open_blocks[0].changed(nudge_text=command.nudge.text, condition_name=command.condition.name, condition_text=command.condition.text), context)
        return self.repository.save(AgentBlock(agent_id=command.agent_id, creator_id=context.actor.id, nudge_key=command.nudge.key, nudge_text=command.nudge.text,
                                               condition_name=command.condition.name, condition_text=command.condition.text), context)
