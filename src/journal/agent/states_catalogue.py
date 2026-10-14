from journal.agent.agent_state import AgentState


class StatesCatalogue:
    """Every state by name, so a row's state column becomes the class that holds its behaviour."""

    def __init__(self, states: tuple[type[AgentState], ...]) -> None: ...

    def named(self, name: str, data: dict) -> AgentState: ...

    @classmethod
    def standard(cls) -> "StatesCatalogue": ...
