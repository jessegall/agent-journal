from engine.agent_machine.contracts.slice_answers import SliceAnswers
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.agent_slices import AgentSlices


class AgentSliceAnswers(SliceAnswers):
    """Reads whether a slice answers an agent from its pinned slices that are still active."""

    def __init__(self, agents: AgentRows, slices: AgentSlices) -> None:
        self.agents, self.slices = agents, slices

    def answers(self, agent_id: int, slice_name: str) -> bool:
        return self.slices.has_active_slice() and slice_name in self.slices.tick_slices(self.agents.find_unscoped(agent_id))
