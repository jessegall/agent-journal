from typing import Protocol


class HookHistory(Protocol):
    """Whether a history rule has control again for a layer: an overlay passed it over the last time it was due."""

    def regained_control(self, agent_id: int, rule: str, layer: str) -> bool: ...
