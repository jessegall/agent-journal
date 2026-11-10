from collections.abc import Mapping


class AgentWork:
    """Work that keeps an agent's place after its process ends, with the current status for its card."""

    def pending(self) -> Mapping[int, str]:
        return {}
