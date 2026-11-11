from collections.abc import Mapping


class AgentWork:
    """Work that keeps an agent's place after its process ends, with the current status for its card, and the
    unit of work it was given when that is more than one task."""

    def pending(self) -> Mapping[int, str]:
        return {}

    def unit_name(self, agent_id: int) -> str:
        return ""
