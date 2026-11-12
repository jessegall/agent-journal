from collections.abc import Mapping, Sequence

from engine.agent.merged_work import MergedWork


class AgentWork:
    """Work that keeps an agent's place after its process ends, with the current status for its card, the
    unit of work it was given when that is more than one task, and what of its work was merged."""

    def pending(self) -> Mapping[int, str]:
        return {}

    def unit_names(self, agent_ids: Sequence[int]) -> Mapping[int, str]:
        return {}

    def merged_work(self, agent_ids: Sequence[int]) -> Mapping[int, MergedWork]:
        return {}
