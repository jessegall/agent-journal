from abc import abstractmethod
from collections.abc import Mapping, Sequence

from engine.agent_machine.record.question import Question
from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource


class AgentPlanStates(StateSource):
    """A state source that holds each agent of the batch by one block plan of its own, or not at all."""

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        plans = {agent.agent_id: self.plan(agent.agent_id) for agent in agents}
        return {agent_id: [plan] for agent_id, plan in plans.items() if plan is not None}

    @abstractmethod
    def plan(self, agent_id: int) -> BlockPlan | None: ...
