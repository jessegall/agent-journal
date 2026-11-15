from collections.abc import Mapping, Sequence

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.fact import Fact
from engine.agent_machine.states.fact_source import FactSource


class FakeFactSource(FactSource):
    """A fact source that gives each agent the facts a test hands it, and records which agents it was asked
    for."""

    fact_types = [Fact]

    def __init__(self, facts: Mapping[int, Sequence[Fact]]) -> None:
        self.given = facts
        self.asked: list[int] = []

    def facts(self, agents: Sequence[AgentReference]) -> Mapping[int, Sequence[Fact]]:
        self.asked += [agent.agent_id for agent in agents]
        return {agent.agent_id: self.given[agent.agent_id] for agent in agents if agent.agent_id in self.given}
