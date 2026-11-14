from collections.abc import Sequence

from engine.driver.open_row import OpenRow
from engine.driver.states.open_blocks import OpenBlocks
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.drivers.models.agent_block import AgentBlock

OPEN_BLOCKS_REASON = "every open block of the agent for the state's nudges"


class AgentOpenBlocks(OpenBlocks):
    """Reads the agent's open blocks for some nudge keys from the stored blocks, one open row each."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def open_rows(self, agent_id: int, nudge_keys: Sequence[str]) -> Sequence[OpenRow]:
        if not nudge_keys:
            return ()
        blocks = self.queries.query(AgentBlock).filter(session_agent_id=agent_id).matching(Among("nudge_key", list(nudge_keys))).matching(IsNull("closed_at"))
        return tuple(OpenRow(AgentBlock.model_name, block.id, block.created_at) for block in blocks.every_row(OPEN_BLOCKS_REASON))
