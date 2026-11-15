from abc import ABC, abstractmethod
from collections.abc import Mapping, Sequence
from typing import ClassVar

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.fact import Fact


class FactSource(ABC):
    """Reads rows for a batch of agents, through injected queries, and gives the typed facts of each."""

    fact_types: ClassVar[Sequence[type[Fact]]]
    agent_types: ClassVar[Sequence[str]] = ()

    @abstractmethod
    def facts(self, agents: Sequence[AgentReference]) -> Mapping[int, Sequence[Fact]]: ...
