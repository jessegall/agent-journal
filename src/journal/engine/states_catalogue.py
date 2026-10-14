from journal.engine.agent_state import AgentState
from journal.features.registry import Registry


class StatesCatalogue:
    """Every state by name: the engine's own and those of every feature that is on. A row's state column becomes the class that holds its behaviour; a state whose feature went off resolves to Idle."""

    def __init__(self, registry: Registry) -> None: ...

    def named(self, name: str, data: dict) -> AgentState: ...
