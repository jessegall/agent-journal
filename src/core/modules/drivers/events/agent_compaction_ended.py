from dataclasses import dataclass

from engine.event.domain_event import DomainEvent
from core.modules.drivers.models.hook_call import COMPACTION_END, HookCall


@dataclass(frozen=True)
class AgentCompactionEnded(DomainEvent[HookCall]):
    """The program of an agent ended the compaction of its context window."""

    change_name = COMPACTION_END
