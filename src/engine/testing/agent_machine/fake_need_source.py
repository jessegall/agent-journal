from collections.abc import Mapping, Sequence

from engine.agent_stack.states.state import State
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.required_state import RequiredState
from engine.agent_machine.needs.state_source import StateSource
from engine.agent_machine.record.question import Question


class FakeNeedSource(StateSource):
    """A need source that gives each agent the needs and hold plans a test hands it, and records the questions
    it was asked with."""

    state_type = State
    rank = "testing.fake"

    def __init__(self, needs: Mapping[int, Sequence[RequiredState | BlockPlan]]) -> None:
        self.given = needs
        self.questions: list[Question] = []

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        self.questions.append(question)
        return {agent.agent_id: self.given[agent.agent_id] for agent in agents if agent.agent_id in self.given}
