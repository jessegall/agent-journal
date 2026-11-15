from abc import ABC, abstractmethod
from collections.abc import Mapping, Sequence
from typing import ClassVar

from engine.agent_stack.states.state import State
from engine.agent_machine.hold_plan import HoldPlan
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.need import Need
from engine.agent_machine.record.question import Question


class NeedSource(ABC):
    """Reads rows for a batch of agents, through injected queries, and says which state instances and which
    hold plans each one has now. Every step reads every need source of the agent's type, so it has no event filter."""

    state_type: ClassVar[type[State]]
    rank: ClassVar[str]
    agent_types: ClassVar[Sequence[str]] = ()
    subject_models: ClassVar[Sequence[str]] = ()

    @abstractmethod
    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | HoldPlan]]: ...
