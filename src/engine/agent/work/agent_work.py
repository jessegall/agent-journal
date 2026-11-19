from collections.abc import Mapping, Sequence

from engine.agent.work.merged_work import MergedWork


class AgentWork:
    """Work that keeps an agent's place after its process ends, with the current status for its card, the
    unit of work it was given when that is more than one task, and what of its work was merged."""

    def pending(self) -> Mapping[int, str]:
        return {}

    # the agents with pending work that still hold a running place after their process ended: those whose work waits on
    # them, not on a test, a review or a merge
    def place_holders(self) -> tuple[int, ...]:
        return ()

    def unit_names(self, agent_ids: Sequence[int]) -> Mapping[int, str]:
        return {}

    def merged_work(self, agent_ids: Sequence[int]) -> Mapping[int, MergedWork]:
        return {}
