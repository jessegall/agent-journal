from dataclasses import dataclass

from core.base.change.domain_event import DomainEvent
from core.modules.drivers.models.hook_call import COMPACTION, HookCall


@dataclass(frozen=True)
class AgentCompacted(DomainEvent[HookCall]):
    """The context window of an agent was compacted."""

    change_name = COMPACTION
