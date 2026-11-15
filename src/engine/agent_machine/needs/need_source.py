from engine.agent.enums.role_group import RoleGroup
from abc import ABC, abstractmethod
from collections.abc import Mapping, Sequence
from typing import ClassVar

from engine.enums.frame_end import FrameEnd
from engine.agent_stack.subject_reference import SubjectReference
from engine.agent_stack.states.state import State
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.need import Need
from engine.agent_machine.record.question import Question


class NeedSource(ABC):
    """Reads rows for a batch of agents, through injected queries, and says which state instances and which
    hold plans each one has now. Every step reads every need source of the agent's type, so it has no event
    filter."""

    state_type: ClassVar[type[State]]
    rank: ClassVar[str]
    agent_types: ClassVar[Sequence[str]] = ()
    # the group of agent types it holds for, read from the helper types as the old walk read a rule's
    role_group: ClassVar[RoleGroup] = RoleGroup.ANY
    # the old driver rules this contribution answers for, which stand down once its slice is in force for the agent
    replaced_rules: ClassVar[Sequence[str]] = ()
    subject_models: ClassVar[Sequence[str]] = ()

    @abstractmethod
    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]: ...

    # how each subject this source gave a frame for, which is gone now, ended: a frame left with it records that end
    # and only a listed end counts as progress (doc 1310 sections 4.3 and 4.6); a source that cannot tell says nothing
    def ends(self, subjects: Sequence[SubjectReference]) -> Mapping[SubjectReference, FrameEnd]:
        return {}
