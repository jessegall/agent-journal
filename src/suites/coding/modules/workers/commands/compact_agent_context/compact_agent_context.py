from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.enums.compaction_reason import CompactionReason


@dataclass(frozen=True)
class CompactAgentContext(Command[None]):
    """Records a compaction of an agent's context with why it is asked, and types the context-limit action into
    the agent's terminal. It is refused while a compaction of that agent is open."""

    agent_id: int
    reason: CompactionReason = CompactionReason.STOP_LIMIT
