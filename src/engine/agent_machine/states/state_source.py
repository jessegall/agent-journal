from engine.agent.enums.role_group import RoleGroup
from abc import ABC, abstractmethod
from collections.abc import Mapping, Sequence
from typing import ClassVar

from engine.enums.state_end import StateEnd
from engine.agent_stack.row_reference import RowReference
from engine.agent_stack.states.state import State
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.record.question import Question


class StateSource(ABC):
    """Reads rows for a batch of agents, through injected queries, and says which state instances and which
    hold plans each one has now. Every step reads every need source of the agent's type, so it has no event
    filter."""

    state_type: ClassVar[type[State]]
    rank: ClassVar[str]
    agent_types: ClassVar[Sequence[str]] = ()
    # the group of agent types it holds for, read from the helper types as the old walk read a rule's
    role_group: ClassVar[RoleGroup] = RoleGroup.ANY
    subject_models: ClassVar[Sequence[str]] = ()

    @abstractmethod
    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]: ...

    # how each subject this source gave a frame for, which is gone now, ended: a frame left with it records that end
    # and only a listed end counts as progress (doc 1310 sections 4.3 and 4.6); a source that cannot tell says nothing
    def ends(self, subjects: Sequence[RowReference]) -> Mapping[RowReference, StateEnd]:
        return {}
