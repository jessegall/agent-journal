from dataclasses import dataclass

from engine.enums.contribution_type import ContributionType
from engine.enums.block_end import BlockEnd
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_carrier import LineCarrier
from engine.enums.transform_slot import TransformSlot


@dataclass(frozen=True)
class ContributionDeclaration:
    """One contribution of a module as sync reads it, whether from its class or from the design's manifest:
    its key, its list, its rank key, the agent types it applies to (none for every type) and what its list
    asks it to declare."""

    key: str
    contribution_type: ContributionType
    rank: str = ""
    agent_types: tuple[str, ...] = ()
    state_name: str = ""
    is_safety: bool = False
    slot: TransformSlot | None = None
    events: tuple[HookEventName, ...] = ()
    carrier: LineCarrier = LineCarrier.NOW
    is_required: bool = False
    has_failure: bool = False
    constructor_types: tuple[str, ...] = ()
    ends: tuple[BlockEnd, ...] = ()
    lifting_lines: tuple[str, ...] = ()

    def covers(self, agent_type: str) -> bool:
        return not self.agent_types or agent_type in self.agent_types
