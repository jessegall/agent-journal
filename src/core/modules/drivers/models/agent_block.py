from dataclasses import dataclass

from core.base.driver.block_condition import BlockCondition
from core.base.driver.block_conditions import BlockConditions
from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class AgentBlock(Model):
    """An agent held from all but reading and journal commands: the line its refused tools are told, what ends
    the block and when it ended."""

    model_name = "agent_block"
    cli_name = "agent-block"

    agent_id: int
    creator_id: int
    nudge_key: str
    nudge_text: str
    condition_name: str
    condition_text: str
    closed_at: Timestamp | None = None

    @property
    def condition(self) -> BlockCondition:
        return BlockConditions.built(self.condition_name, self.condition_text)
