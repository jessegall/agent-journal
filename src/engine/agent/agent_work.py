from collections.abc import Mapping, Sequence

from engine.time.timestamp import Timestamp


class AgentWork:
    """Work that keeps an agent's place after its process ends, with the current status for its card, the
    unit of work it was given when that is more than one task, and when its work was last merged."""

    def pending(self) -> Mapping[int, str]:
        return {}

    def unit_names(self, agent_ids: Sequence[int]) -> Mapping[int, str]:
        return {}

    def last_merges(self, agent_ids: Sequence[int]) -> Mapping[int, Timestamp]:
        return {}
